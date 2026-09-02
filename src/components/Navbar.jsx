import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  Cpu, 
  Database, 
  Zap, 
  FileDown, 
  Flame, 
  CheckCircle2, 
  AlertTriangle,
  Github,
  RefreshCw
} from 'lucide-react';
import { testSupabaseConnection } from '../services/supabaseClient';
import { isQStashConfigured } from '../services/qstashService';
import { chaosModeEnabled, setChaosMode, exportSystemAuditPdf } from '../services/taskWorkerEngine';
import confetti from 'canvas-confetti';

export default function Navbar({ onOpenSubmitModal, onOpenDlqModal, dlqCount = 0 }) {
  const [supabaseStatus, setSupabaseStatus] = useState({ connected: false, message: 'Checking...' });
  const [chaosActive, setChaosActive] = useState(chaosModeEnabled);

  useEffect(() => {
    testSupabaseConnection().then(setSupabaseStatus);
  }, []);

  const handleToggleChaos = () => {
    const newState = !chaosActive;
    setChaosActive(newState);
    setChaosMode(newState);
  };

  const handleExportAudit = () => {
    exportSystemAuditPdf();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#060913]/85 backdrop-blur-xl px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand & Project Identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 shadow-lg shadow-cyan-500/25 p-0.5">
            <div className="w-full h-full bg-[#090D16] rounded-[10px] flex items-center justify-center">
              <Zap className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white font-display">
                Serverless<span className="gradient-text">Flow</span>
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                v2.0 Cloud
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono hidden sm:block">
              Distributed Asynchronous Task Processing Engine
            </p>
          </div>
        </div>

        {/* Live Cloud Status Indicators */}
        <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
          {/* Supabase Status */}
          <div className="flex items-center gap-1.5" title={supabaseStatus.message}>
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-300 font-medium">Supabase:</span>
            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-semibold ${
              supabaseStatus.connected 
                ? 'bg-emerald-500/15 text-emerald-400' 
                : 'bg-amber-500/15 text-amber-400'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${supabaseStatus.connected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
              {supabaseStatus.connected ? 'Active' : 'Local Mode'}
            </span>
          </div>

          <div className="w-px h-3.5 bg-slate-700 mx-1" />

          {/* QStash Status */}
          <div className="flex items-center gap-1.5">
            <Cloud className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-300 font-medium">QStash Queue:</span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/15 text-indigo-300">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
              {isQStashConfigured ? 'Connected' : 'Simulated'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Chaos / Fault Injector Toggle */}
          <button
            onClick={handleToggleChaos}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              chaosActive 
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-lg shadow-rose-500/20 animate-pulse' 
                : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:border-rose-500/40 hover:text-rose-300'
            }`}
            title="Inject worker timeouts & errors to demonstrate automatic retries and DLQ failover for examiners"
          >
            <Flame className={`w-3.5 h-3.5 ${chaosActive ? 'text-rose-400' : 'text-slate-400'}`} />
            <span>Chaos Mode: {chaosActive ? 'ON' : 'OFF'}</span>
          </button>

          {/* Dead-Letter Queue button */}
          {dlqCount > 0 && (
            <button
              onClick={onOpenDlqModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all animate-bounce"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>DLQ ({dlqCount})</span>
            </button>
          )}

          {/* Export PDF Audit */}
          <button
            onClick={handleExportAudit}
            className="btn-secondary text-xs !py-1.5 !px-3"
            title="Export verification PDF audit for project defense"
          >
            <FileDown className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Export Audit</span>
          </button>

          {/* New Task Trigger Button */}
          <button
            onClick={onOpenSubmitModal}
            className="btn-primary text-xs !py-1.5 !px-3.5"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>+ Dispatch Task</span>
          </button>
        </div>

      </div>
    </header>
  );
}
