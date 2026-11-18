import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { validateAuditPayload } from "@/lib/validation";
import { runAutonomousAudit } from "@/services/audit";

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limit = checkRateLimit(ip);
  if (limit.limited) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Max 10 requests per minute." },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSec) },
      }
    );
  }

  try {
    const body = await req.json();
    // Accept legacy { address } while validating through { query }
    const normalized = {
      query: body?.query ?? body?.address,
      chain: body?.chain,
    };

    const validated = validateAuditPayload(normalized);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const { query, chain } = validated.data;
    const result = await runAutonomousAudit(query, chain);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Agent Failure";
    console.error("Multi-Chain API Error:", message);
    return NextResponse.json(
      { error: "Internal Agent Failure" },
      { status: 500 }
    );
  }
}
