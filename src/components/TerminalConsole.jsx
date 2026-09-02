import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Trash2, Filter, ShieldCheck, Zap } from 'lucide-react';

export default function TerminalConsole({ logs = [], selectedTaskId }) {
  const [filterLevel, setFilterLevel] = useState('ALL');
  const [autoScroll, setAutoScroll] = useState(true);
  const consoleEndRef = useRef(null);

  const filteredLogs = logs.filter(log => {
    const matchesLevel = filterLevel === 'ALL' || log.level === filterLevel;
    const matchesTask = !selectedTaskId || log.taskId === selectedTaskId;
    return matchesLevel && matchesTask;
  });

  useEffect(() => {
    if (autoScroll && consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const getLevelStyle = (level) => {
    switch (level) {
      case 'SUCCESS': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'ERROR': return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'WARN': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'DEBUG': return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      default: return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
    }
  };

  return (
    <div className="glass-panel p-4 mb-6">
      
      {/* Console Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700/70 text-xs font-mono text-cyan-400">
            <Terminal className="w-3.5 h-3.5" />
            <span>Worker Telemetry & Execution Stream</span>
          </div>
          {selectedTaskId && (
            <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
              Filter: {selectedTaskId.slice(-6)}
            </span>
          )}
        </div>

        {/* Level Filters & Auto-scroll */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-300 focus:outline-none focus:border-cyan-500 text-xs"
          >
            <option value="ALL">All Levels ({logs.length})</option>
            <option value="INFO">INFO</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="WARN">WARN</option>
            <option value="ERROR">ERROR</option>
            <option value="DEBUG">DEBUG</option>
          </select>

          <label className="flex items-center gap-1.5 text-slate-400 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span>Auto-Scroll</span>
          </label>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="terminal-window mt-3 p-3 max-h-[320px] overflow-y-auto space-y-1.5 font-mono text-xs">
        {filteredLogs.length === 0 ? (
          <div className="text-slate-600 italic py-6 text-center">
            &gt; Initialized serverless telemetry buffer. Awaiting incoming worker event streams...
          </div>
        ) : (
          filteredLogs.map((log) => {
            const timeStr = new Date(log.timestamp).toLocaleTimeString();
            return (
              <div key={log.id} className="flex items-start gap-2.5 hover:bg-slate-900/60 p-1 rounded transition-colors leading-relaxed">
                <span className="text-slate-500 select-none text-[11px]">{timeStr}</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border uppercase ${getLevelStyle(log.level)}`}>
                  {log.level}
                </span>
                <span className="text-slate-300 break-all flex-1">
                  {log.message}
                </span>
              </div>
            );
          })
        )}
        <div ref={consoleEndRef} />
      </div>

    </div>
  );
}
