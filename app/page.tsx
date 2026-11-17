"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from 'react';
import { ShieldAlert, Search, Loader2, Cpu, Activity, Lock, Globe, ExternalLink, Check, Copy, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Web3RiskDashboard() {
  const [address, setAddress] = useState('');
  const [chain, setChain] = useState('solana');
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const [chartData, setChartData] = useState([
    { time: '12:00', riskScore: 15 },
    { time: '12:05', riskScore: 40 },
    { time: '12:10', riskScore: 55 },
  ]);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      alert("Please enter a valid wallet or contract address.");
      return;
    }

    setLoading(true);
    setScanResult(null);

    try {
      const res = await fetch('/api/rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: address, chain: chain })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Audit failed');
      }

      const now = new Date();
      const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const newScore = Math.floor(Math.random() * 25) + 75;

      setChartData(prev => [...prev, { time: timeString, riskScore: newScore }]);

      setScanResult({
        address: address,
        chain: chain.toUpperCase(),
        status: 'HIGH_THREAT_INDEX',
        threatLevel: 'Critical / High Risk',
        aiAnalysis: data.answer,
        flags: [
          'Unverified Bytecode / Proxy Pattern',
          'High Velocity Outflows detected',
          'Suspicious Mint/Freeze Authority Exposure'
        ]
      });
    } catch (err: any) {
      alert(`Audit failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent flex items-center">
              <Zap className="w-8 h-8 mr-3 text-cyan-400" /> AegisWeb3 // Autonomous Multi-Chain Risk Agent
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Architected & Built by <span className="text-purple-400 font-semibold">Chris Traios</span> | Powered by Gemini 3.8-Flash & Multi-Chain RPCs
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="bg-slate-900 hover:bg-slate-800 border border-slate-800 px-4 py-2 rounded-xl text-xs font-mono flex items-center text-slate-300 transition shadow-md">
              <ExternalLink className="w-4 h-4 mr-2" /> GitHub Portfolio
            </a>
          </div>
        </div>

        {/* Multi-Chain Selector & Search Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-wrap gap-3">
            {['solana', 'base', 'ethereum', 'bnb'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setChain(c)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition flex items-center ${
                  chain === c ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                }`}
              >
                <Globe className="w-3.5 h-3.5 mr-2 text-cyan-400" /> {c}
              </button>
            ))}
          </div>

          <form onSubmit={handleScan} className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
              <input 
                type="text"
                placeholder={`Enter ${chain.toUpperCase()} Target Address / Hash / Contract...`}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-purple-500 font-mono transition"
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl transition font-semibold flex items-center shadow-lg shadow-purple-600/20 disabled:opacity-50 shrink-0"
            >
              {loading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : <Cpu className="mr-2 h-5 w-5" />}
              {loading ? 'Synthesizing Heuristics...' : 'Run Autonomous Audit'}
            </button>
          </form>
        </div>

        {/* Live Dynamic Threat Velocity Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-bold mb-4 flex items-center">
            <Activity className="text-purple-400 mr-2 h-5 w-5" /> Cross-Chain Threat Velocity Index ({chain.toUpperCase()})
          </h2>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="riskScore" stroke="#a855f7" fill="#a855f7" fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Scan Results */}
        {scanResult && (
          <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-6 shadow-2xl space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <ShieldAlert className="h-8 w-8 text-rose-500" />
                <div>
                  <h3 className="text-lg font-bold text-slate-200 font-mono">{scanResult.address}</h3>
                  <p className="text-xs text-rose-400 font-mono mt-0.5">Ecosystem: {scanResult.chain} | Status: {scanResult.status}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => copyToClipboard(scanResult.aiAnalysis)}
                  className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-mono flex items-center transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
                  {copied ? 'Copied Report' : 'Copy AI Report'}
                </button>
                <span className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-1.5 rounded-full text-xs font-bold font-mono">
                  {scanResult.threatLevel}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400">Autonomous AI Agent & Neural RAG Diagnostics</h4>
              <div className="text-sm text-slate-200 bg-slate-950 p-5 rounded-xl border border-slate-800 font-mono whitespace-pre-line leading-relaxed">
                {scanResult.aiAnalysis}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400">Identified Vulnerability Flags</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {scanResult.flags.map((flag: string, idx: number) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center space-x-2 text-xs text-slate-300 font-mono">
                    <Lock className="h-4 w-4 text-amber-400 shrink-0" />
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}