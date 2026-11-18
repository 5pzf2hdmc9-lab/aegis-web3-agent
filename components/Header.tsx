import { ExternalLink, Zap } from "lucide-react";

export function Header() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 gap-4">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent flex items-center">
          <Zap className="w-8 h-8 mr-3 text-cyan-400" />
          AegisWeb3 // Autonomous Multi-Chain Risk Agent
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Architected & Built by{" "}
          <span className="text-purple-400 font-semibold">Chris Traios</span> |
          Powered by Gemini AI & Multi-Chain RPCs
        </p>
      </div>
      <a
        href="https://github.com/5pzf2hdmc9-lab/aegischain-risk-agent"
        target="_blank"
        rel="noreferrer"
        className="bg-slate-900 hover:bg-slate-800 border border-slate-800 px-4 py-2 rounded-xl text-xs font-mono flex items-center text-slate-300 transition shadow-md"
      >
        <ExternalLink className="w-4 h-4 mr-2" /> GitHub Portfolio
      </a>
    </div>
  );
}
