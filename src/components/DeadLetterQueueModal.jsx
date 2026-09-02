import React from 'react';
import { X, AlertTriangle, RotateCcw, Trash2, Code, ShieldAlert } from 'lucide-react';
import { retryDLQTask } from '../services/taskWorkerEngine';

export default function DeadLetterQueueModal({ isOpen, onClose, dlqTasks = [] }) {
  if (!isOpen) return null;

  const handleRetry = (dlqId) => {
    retryDLQTask(dlqId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel-glow w-full max-w-3xl max-h-[85vh] overflow-y-auto p-6 relative border-amber-500/40">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-white">
              Dead-Letter Queue (DLQ) Inspector
            </h2>
            <p className="text-xs text-slate-400">
              Isolates corrupted or persistently failing tasks after 3 automatic retries
            </p>
          </div>
        </div>

        {/* DLQ List */}
        <div className="space-y-4">
          {dlqTasks.length === 0 ? (
            <div className="text-center py-10 px-4 border border-slate-800 rounded-xl bg-slate-900/40">
              <ShieldAlert className="w-10 h-10 text-emerald-500/60 mx-auto mb-2" />
              <h4 className="text-sm font-semibold text-slate-200">Dead-Letter Queue is Empty</h4>
              <p className="text-xs text-slate-500 mt-1">
                All cloud serverless worker tasks have executed reliably or recovered automatically.
              </p>
            </div>
          ) : (
            dlqTasks.map((item) => (
              <div
                key={item.id}
                className="glass-card p-4 border border-rose-500/30 bg-rose-950/10"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
                  <div>
                    <span className="text-sm font-bold text-white font-display">
                      {item.task_name}
                    </span>
                    <span className="text-xs font-mono text-slate-400 ml-2">
                      ({item.task_id.slice(-6)})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                      Failed Attempts: {item.attempts || 3}
                    </span>
                    <button
                      onClick={() => handleRetry(item.id)}
                      className="btn-primary text-xs !py-1 !px-2.5"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Replay Task</span>
                    </button>
                  </div>
                </div>

                <div className="mt-2.5">
                  <span className="text-xs font-semibold text-rose-300 block mb-1">
                    Failure Reason:
                  </span>
                  <p className="text-xs text-rose-200/90 font-mono bg-slate-950/80 p-2.5 rounded-lg border border-rose-500/20">
                    {item.failure_reason}
                  </p>
                </div>

                {item.payload && (
                  <div className="mt-2.5">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Payload Snapshot:
                    </span>
                    <pre className="text-[11px] font-mono text-slate-300 bg-slate-950 p-2 rounded overflow-x-auto max-h-24">
                      {JSON.stringify(item.payload, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button onClick={onClose} className="btn-secondary text-xs">
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
}
