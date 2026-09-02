import React from 'react';
import { 
  Activity, 
  Clock, 
  CheckCircle, 
  Layers, 
  Cpu, 
  Zap, 
  ShieldAlert,
  Server
} from 'lucide-react';

export default function MetricsCards({ tasks = [], metrics = {}, dlqCount = 0 }) {
  const queuedCount = tasks.filter(t => t.status === 'QUEUED').length;
  const processingCount = tasks.filter(t => t.status === 'PROCESSING' || t.status === 'RETRYING').length;
  const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;
  const failedCount = tasks.filter(t => t.status === 'FAILED').length;

  const totalTasks = tasks.length;
  const successRate = totalTasks > 0 ? Math.round((completedCount / (completedCount + failedCount || 1)) * 100) : 100;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* 1. Queue Depth & Processing Card */}
      <div className="glass-card p-4 relative overflow-hidden border-cyan-500/20">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Queue & In-Flight</span>
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/25">
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-display text-white">{queuedCount + processingCount}</span>
          <span className="text-xs text-cyan-400 font-mono">active tasks</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
          <span>Queued: <strong className="text-sky-300">{queuedCount}</strong></span>
          <span>Workers Running: <strong className="text-amber-400">{processingCount}</strong></span>
        </div>
      </div>

      {/* 2. Execution Latency Card */}
      <div className="glass-card p-4 relative overflow-hidden border-indigo-500/20">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Latency</span>
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/25">
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-display text-white">{metrics.avgLatencyMs || 240}</span>
          <span className="text-xs text-indigo-400 font-mono">ms / worker</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
          <span>Speed: <strong className="text-emerald-400">Sub-Second</strong></span>
          <span>Cold Start: <strong className="text-indigo-300">&lt;50ms</strong></span>
        </div>
      </div>

      {/* 3. Reliability & Success Rate Card */}
      <div className="glass-card p-4 relative overflow-hidden border-emerald-500/20">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Reliability & Health</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/25">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-display text-white">{successRate}%</span>
          <span className="text-xs text-emerald-400 font-mono">success rate</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
          <span>Completed: <strong className="text-emerald-400">{completedCount}</strong></span>
          <span>Failed: <strong className={failedCount > 0 ? 'text-rose-400' : 'text-slate-500'}>{failedCount}</strong></span>
        </div>
      </div>

      {/* 4. Serverless Worker Nodes Card */}
      <div className="glass-card p-4 relative overflow-hidden border-amber-500/20">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Elastic Scale</span>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/25">
            <Cpu className="w-4 h-4 text-amber-400" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-display text-white">{processingCount > 0 ? processingCount : '0 (Idle)'}</span>
          <span className="text-xs text-amber-400 font-mono">scaled microVMs</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
          <span>Auto-Scale: <strong className="text-emerald-400">Scale to 0</strong></span>
          <span>DLQ Items: <strong className={dlqCount > 0 ? 'text-rose-400' : 'text-slate-400'}>{dlqCount}</strong></span>
        </div>
      </div>

    </div>
  );
}
