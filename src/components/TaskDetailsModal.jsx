import React from 'react';
import { X, CheckCircle2, Clock, RotateCw, AlertCircle, Download, Eye, Cpu, Database, Server } from 'lucide-react';

export default function TaskDetailsModal({ task, onClose }) {
  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel-glow w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 relative border-cyan-500/30">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-white">
              {task.task_name}
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Task ID: {task.id}
            </p>
          </div>
        </div>

        {/* Telemetry Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Status</span>
            <span className="text-xs font-bold text-cyan-300">{task.status}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Execution Time</span>
            <span className="text-xs font-bold text-emerald-400">{task.execution_time_ms || 0} ms</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Worker Node</span>
            <span className="text-xs font-bold text-indigo-300 font-mono">{task.worker_id || 'Queued'}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Retries</span>
            <span className="text-xs font-bold text-amber-300">{task.retry_count} / {task.max_retries}</span>
          </div>
        </div>

        {/* Payload Section */}
        <div className="mb-4">
          <span className="text-xs font-semibold text-slate-300 block mb-1.5">
            Input Payload:
          </span>
          <pre className="p-3 rounded-lg bg-[#050811] border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto max-h-36">
            {JSON.stringify(task.payload, null, 2)}
          </pre>
        </div>

        {/* Execution Result Artifact */}
        {task.result && (
          <div className="mb-4">
            <span className="text-xs font-semibold text-emerald-300 block mb-1.5">
              Worker Execution Result:
            </span>
            <pre className="p-3 rounded-lg bg-[#050811] border border-emerald-500/20 text-xs font-mono text-emerald-300 overflow-x-auto max-h-48">
              {JSON.stringify(task.result, null, 2)}
            </pre>

            {/* Direct download / preview links */}
            <div className="mt-3 flex items-center gap-3">
              {task.result.downloadUrl && (
                <a
                  href={task.result.downloadUrl}
                  download={task.result.filename || 'report.pdf'}
                  className="btn-primary text-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Generated Document ({task.result.filename})</span>
                </a>
              )}

              {task.result.previewUrl && (
                <a
                  href={task.result.previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary text-xs"
                >
                  <Eye className="w-4 h-4 text-cyan-400" />
                  <span>View Processed Image Preview</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button onClick={onClose} className="btn-secondary text-xs">
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
