import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { validateAuditPayload } from "@/lib/validation";
import { runAutonomousAudit } from "@/services/audit";

const MAX_BODY_BYTES = 4_096;

export async function POST(req: Request) {
  const contentLength = Number(req.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: "Request body too large." },
      { status: 400 }
    );
  }

  let body: unknown;
  try {
    const text = await req.text();
    if (text.length > MAX_BODY_BYTES) {
      return NextResponse.json(
        { error: "Request body too large." },
        { status: 400 }
      );
    }
    body = JSON.parse(text);
  } catch {
    return NextResponse.json(
      { error: "Malformed JSON body." },
      { status: 400 }
    );
  }

  const normalized = {
    query:
      body && typeof body === "object"
        ? (body as { query?: unknown; address?: unknown }).query ??
          (body as { address?: unknown }).address
        : undefined,
    chain:
      body && typeof body === "object"
        ? (body as { chain?: unknown }).chain
        : undefined,
  };

  const validated = validateAuditPayload(normalized);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const ip = getClientIp(req);
  const limit = await checkRateLimit(ip);
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
    const { query, chain } = validated.data;
    const report = await runAutonomousAudit(query, chain);
    // Keep legacy `answer` string for older clients; primary contract is `report`
    const answer = [
      `Verdict: ${report.verdict}`,
      `Completeness: ${report.completeness}`,
      `Score: ${report.riskScore === null ? "n/a" : report.riskScore}`,
      report.verdictReason,
      report.nextAction,
      report.aiSummary ?? "",
      report.cleanIsNotSafeNote,
    ]
      .filter(Boolean)
      .join("\n\n");

    return NextResponse.json({ report, answer });
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
