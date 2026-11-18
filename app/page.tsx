"use client";

import { useState } from "react";
import { flushSync } from "react-dom";
import { Header } from "@/components/Header";
import { ChainSelector } from "@/components/ChainSelector";
import { SearchForm } from "@/components/SearchForm";
import { QuickTestTargets } from "@/components/QuickTestTargets";
import { AuditsFeed } from "@/components/AuditsFeed";
import { ScanResults } from "@/components/ScanResults";
import { Footer } from "@/components/Footer";
import { formatClock } from "@/lib/audit-helpers";
import { isAddressValidForChain, type ChainId } from "@/lib/validation";
import type { AuditFeedItem, AuditReport, QuickTarget } from "@/lib/types";

export default function Web3RiskDashboard() {
  const [address, setAddress] = useState("");
  const [chain, setChain] = useState<ChainId>("solana");
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<AuditReport | null>(null);
  const [copied, setCopied] = useState(false);
  const [feed, setFeed] = useState<AuditFeedItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const runAudit = async (targetAddress: string, targetChain: ChainId) => {
    if (!targetAddress.trim()) {
      setError("Please enter a valid wallet or contract address.");
      return;
    }
    if (!isAddressValidForChain(targetAddress.trim(), targetChain)) {
      setError(
        targetChain === "solana"
          ? "Invalid Solana address. Expected base58 (32–44 chars)."
          : "Invalid EVM address. Expected 0x followed by 40 hex characters."
      );
      return;
    }

    setLoading(true);
    setScanResult(null);
    setError(null);

    try {
      const res = await fetch("/api/rag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: targetAddress.trim(), chain: targetChain }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Audit failed");
      }

      const report = data.report as AuditReport | undefined;
      if (!report || !report.verdict || !Array.isArray(report.flags)) {
        throw new Error("Incomplete audit response from server.");
      }

      const timestamp = formatClock();
      setScanResult(report);

      setFeed((prev) =>
        [
          {
            id: `${Date.now()}-${targetAddress.slice(0, 8)}`,
            address: targetAddress.trim(),
            chain: targetChain,
            riskScore: report.riskScore,
            threatLevel: report.threatLevel,
            verdict: report.verdict,
            timestamp,
          },
          ...prev,
        ].slice(0, 12)
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Audit failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    await runAudit(address, chain);
  };

  const handleQuickTarget = async (target: QuickTarget) => {
    flushSync(() => {
      setAddress(target.address);
      setChain(target.chain);
    });
    await runAudit(target.address, target.chain);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <Header />

        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3 text-xs font-mono text-cyan-200/90">
          Paste-only scan — we never ask for your seed phrase or a wallet connection.
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <ChainSelector chain={chain} onChange={setChain} />
          <SearchForm
            address={address}
            chain={chain}
            loading={loading}
            onAddressChange={setAddress}
            onSubmit={handleScan}
          />
          <QuickTestTargets disabled={loading} onSelect={handleQuickTarget} />
          {error && (
            <p className="text-sm text-rose-400 font-mono border border-rose-500/30 bg-rose-500/5 rounded-xl px-4 py-3">
              {error}
            </p>
          )}
        </div>

        <AuditsFeed items={feed} />
        {scanResult && (
          <ScanResults
            result={scanResult}
            copied={copied}
            onCopy={copyToClipboard}
          />
        )}

        <Footer />
      </div>
    </div>
  );
}
