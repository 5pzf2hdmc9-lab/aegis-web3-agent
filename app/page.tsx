"use client";

import { useEffect, useRef, useState } from "react";
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

const FEED_KEY = "aegisweb3.auditFeed.v1";

export default function Web3RiskDashboard() {
  const [address, setAddress] = useState("");
  const [chain, setChain] = useState<ChainId>("solana");
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<AuditReport | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [feed, setFeed] = useState<AuditFeedItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const reqIdRef = useRef(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const raw = sessionStorage.getItem(FEED_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw) as AuditFeedItem[];
        if (Array.isArray(parsed)) setFeed(parsed.slice(0, 12));
      } catch {
        /* ignore corrupt session feed */
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(FEED_KEY, JSON.stringify(feed));
    } catch {
      /* quota / private mode */
    }
  }, [feed]);

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

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    const reqId = ++reqIdRef.current;

    setLoading(true);
    setScanResult(null);
    setError(null);
    setCopyError(null);

    try {
      const res = await fetch("/api/rag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: targetAddress.trim(), chain: targetChain }),
        signal: ac.signal,
      });
      const data = await res.json();
      if (reqId !== reqIdRef.current) return;
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
      if (reqId !== reqIdRef.current) return;
      if (err instanceof DOMException && err.name === "AbortError") return;
      const message = err instanceof Error ? err.message : "Audit failed";
      setError(message);
    } finally {
      if (reqId === reqIdRef.current) setLoading(false);
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

  const copyToClipboard = async (text: string) => {
    setCopyError(null);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      setCopyError("Clipboard copy failed — select and copy manually.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans overflow-x-hidden">
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
          {copyError && (
            <p className="text-sm text-amber-400 font-mono border border-amber-500/30 bg-amber-500/5 rounded-xl px-4 py-3">
              {copyError}
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
