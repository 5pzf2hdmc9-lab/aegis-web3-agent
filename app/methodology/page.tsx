import Link from "next/link";

export default function MethodologyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-6 py-12">
      <div className="max-w-3xl mx-auto space-y-8 font-mono text-sm leading-relaxed">
        <Link href="/" className="text-cyan-400 hover:underline text-xs">
          ← Back to scanner
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">AegisWeb3 Methodology</h1>
        <p className="text-slate-400">
          How we score risk, what we check, and what we deliberately do not claim.
        </p>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-200">1. Deterministic layer (RPC)</h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-300">
            <li>EVM: <code>eth_getCode</code> → true bytecode byte length (hex-decoded), EOA vs contract, EIP-1967 / DELEGATECALL proxy heuristic.</li>
            <li>Solana: <code>getAccountInfo</code> → account presence (null ≠ “empty verified”), lamports, owner, mint/freeze authority when parsed.</li>
            <li>Paste mode never enumerates live approvals — we flag that limit and deep-link to revoke tooling.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-200">2. AI layer (interpretive only)</h2>
          <p className="text-slate-300">
            Gemini receives sanitized address + deterministic flags and returns structured JSON commentary.
            It must not invent on-chain facts. If Gemini times out or is capped, the UI shows{" "}
            <strong>PARTIAL / UNAVAILABLE</strong> — never fabricated vulnerability lists.
          </p>
          <p className="text-slate-400">
            There is no vector store or “Neural RAG” retrieval pipeline. The route is named{" "}
            <code>/api/rag</code> for historical reasons only.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-200">3. Verdicts</h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-300">
            <li><strong>Do Not Sign</strong> — high/critical evidence-backed flags.</li>
            <li><strong>Caution — Revoke First</strong> — moderate residual risk or incomplete scan.</li>
            <li><strong>Safe to Proceed (size-cap)</strong> — no high/critical findings on completed checks; still not unrugable.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-200">4. Anti-badge stance</h2>
          <p className="text-slate-300">
            An audit badge or letter grade does not prove a project is unrugable. CLEAN surface checks ≠ SAFE.
            Always verify flags on a block explorer before signing.
          </p>
        </section>

        <section className="space-y-3 border-t border-slate-800 pt-6 text-xs text-slate-500">
          <p>
            Non-financial / non-audit advice. AI-assisted analysis under EU AI Act transparency expectations.
            We do not store wallet private keys or seed phrases (GDPR data minimization).
          </p>
        </section>
      </div>
    </main>
  );
}
