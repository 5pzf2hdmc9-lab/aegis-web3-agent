/**
 * Serverless-safe Gemini spend / burst cap via globalThis.
 * Optional Redis (Upstash) if UPSTASH_REDIS_REST_URL + TOKEN are set.
 */

type SpendState = { day: string; count: number; burstWindowStart: number; burstCount: number };

const g = globalThis as typeof globalThis & { __aegisSpend?: SpendState };

const DAILY_MAX = Number(process.env.GEMINI_DAILY_CAP || 200);
const BURST_MAX = Number(process.env.GEMINI_BURST_CAP || 20);
const BURST_WINDOW_MS = 60_000;

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function localState(): SpendState {
  const day = todayKey();
  if (!g.__aegisSpend || g.__aegisSpend.day !== day) {
    g.__aegisSpend = { day, count: 0, burstWindowStart: Date.now(), burstCount: 0 };
  }
  const s = g.__aegisSpend;
  const now = Date.now();
  if (now - s.burstWindowStart >= BURST_WINDOW_MS) {
    s.burstWindowStart = now;
    s.burstCount = 0;
  }
  return s;
}

export async function checkAndConsumeGeminiQuota(): Promise<
  { ok: true } | { ok: false; error: string; status: 429 }
> {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (upstashUrl && upstashToken) {
    return upstashConsume(upstashUrl, upstashToken);
  }
  return localConsume();
}

function localConsume(): { ok: true } | { ok: false; error: string; status: 429 } {
  const s = localState();
  if (s.count >= DAILY_MAX) {
    return { ok: false, error: "Daily AI spend cap reached. Try again tomorrow.", status: 429 };
  }
  if (s.burstCount >= BURST_MAX) {
    return { ok: false, error: "AI burst cap exceeded. Wait ~1 minute.", status: 429 };
  }
  s.count += 1;
  s.burstCount += 1;
  return { ok: true };
}

async function upstashConsume(
  url: string,
  token: string
): Promise<{ ok: true } | { ok: false; error: string; status: 429 }> {
  const day = todayKey();
  const dailyKey = `aegis:gemini:day:${day}`;
  const burstKey = `aegis:gemini:burst:${Math.floor(Date.now() / BURST_WINDOW_MS)}`;
  try {
    const res = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", dailyKey],
        ["EXPIRE", dailyKey, 90000],
        ["INCR", burstKey],
        ["EXPIRE", burstKey, 120],
      ]),
      signal: AbortSignal.timeout(3_000),
    });
    if (!res.ok) return localConsume();
    const data = (await res.json()) as { result?: Array<{ result?: number }> };
    const daily = Number(data?.result?.[0]?.result ?? 0);
    const burst = Number(data?.result?.[2]?.result ?? 0);
    if (daily > DAILY_MAX) {
      return { ok: false, error: "Daily AI spend cap reached. Try again tomorrow.", status: 429 };
    }
    if (burst > BURST_MAX) {
      return { ok: false, error: "AI burst cap exceeded. Wait ~1 minute.", status: 429 };
    }
    return { ok: true };
  } catch {
    return localConsume();
  }
}
