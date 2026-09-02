import React from 'react';
import { Cloud, Cpu, Database, ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export default function ArchitectureHero() {
  return (
    <div className="glass-panel p-6 mb-6 relative overflow-hidden border-cyan-500/20">
      
      {/* Background glow flair */}
      <div className="absolute -right-10 -top-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        
        {/* Project Header Info */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Academic Project • Final Year Engineering Showcase</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight leading-tight">
            Cloud-Based Serverless <span className="gradient-text">Task Processing System</span>
          </h2>

          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            An elastic, decoupled distributed computing pipeline designed with non-blocking async task dispatching, automatic retry mechanisms, and Dead-Letter Queue (DLQ) fault tolerance.
          </p>
        </div>

        {/* Visual Architecture Flow Badge */}
        <div className="w-full lg:w-auto bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
            Distributed Execution Flow
          </span>
          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-300">
            <span className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Client UI</span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span className="px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">QStash Queue</span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">Serverless Workers</span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Supabase DB</span>
          </div>
        </div>

      </div>

    </div>
  );
}
