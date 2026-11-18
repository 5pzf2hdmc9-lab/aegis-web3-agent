type Bucket = { timestamps: number[] };

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;

const buckets = new Map<string, Bucket>();

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return req.headers.get("x-real-ip") || "unknown";
}

/** Returns remaining wait ms if limited, otherwise null. */
export function checkRateLimit(ip: string): { limited: boolean; retryAfterSec: number } {
  const now = Date.now();
  const bucket = buckets.get(ip) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < WINDOW_MS);

  if (bucket.timestamps.length >= MAX_REQUESTS) {
    const oldest = bucket.timestamps[0] ?? now;
    const retryAfterSec = Math.max(1, Math.ceil((WINDOW_MS - (now - oldest)) / 1000));
    buckets.set(ip, bucket);
    return { limited: true, retryAfterSec };
  }

  bucket.timestamps.push(now);
  buckets.set(ip, bucket);
  return { limited: false, retryAfterSec: 0 };
}
