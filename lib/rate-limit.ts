/**
 * Durable-ish IP rate limit: globalThis (survives warm serverless) + optional Upstash.
 */

type Bucket = { timestamps: number[] };

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;

const g = globalThis as typeof globalThis & { __aegisRl?: Map<string, Bucket> };

function buckets(): Map<string, Bucket> {
  if (!g.__aegisRl) g.__aegisRl = new Map();
  return g.__aegisRl;
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return req.headers.get("x-real-ip") || "unknown";
}

export async function checkRateLimit(
  ip: string
): Promise<{ limited: boolean; retryAfterSec: number }> {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (upstashUrl && upstashToken) {
    try {
      return await upstashLimit(ip, upstashUrl, upstashToken);
    } catch {
      /* fall through to memory */
    }
  }
  return memoryLimit(ip);
}

function memoryLimit(ip: string): { limited: boolean; retryAfterSec: number } {
  const now = Date.now();
  const map = buckets();
  const bucket = map.get(ip) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < WINDOW_MS);

  if (bucket.timestamps.length >= MAX_REQUESTS) {
    const oldest = bucket.timestamps[0] ?? now;
    const retryAfterSec = Math.max(1, Math.ceil((WINDOW_MS - (now - oldest)) / 1000));
    map.set(ip, bucket);
    return { limited: true, retryAfterSec };
  }

  bucket.timestamps.push(now);
  map.set(ip, bucket);
  return { limited: false, retryAfterSec: 0 };
}

async function upstashLimit(
  ip: string,
  url: string,
  token: string
): Promise<{ limited: boolean; retryAfterSec: number }> {
  const key = `aegis:rl:${ip}:${Math.floor(Date.now() / WINDOW_MS)}`;
  const res = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      ["INCR", key],
      ["EXPIRE", key, 120],
    ]),
    signal: AbortSignal.timeout(3_000),
  });
  if (!res.ok) return memoryLimit(ip);
  const data = (await res.json()) as { result?: Array<{ result?: number }> };
  const count = Number(data?.result?.[0]?.result ?? 0);
  if (count > MAX_REQUESTS) {
    return { limited: true, retryAfterSec: 60 };
  }
  return { limited: false, retryAfterSec: 0 };
}
