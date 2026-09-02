import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  RotateCw, 
  Download, 
  Eye, 
  Layers, 
  Cpu, 
  FileText, 
  ImageIcon, 
  Database, 
  Zap,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function TaskBoard({ tasks = [], onSelectTask, selectedTaskId }) {
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'ALL' || task.status === filter;
    const matchesSearch = task.task_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.task_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status, retries, maxRetries) => {
    switch (status) {
      case 'QUEUED':
        return <span className="badge badge-queued"><Clock className="w-3 h-3" /> Queued</span>;
      case 'PROCESSING':
        return <span className="badge badge-processing"><RotateCw className="w-3 h-3 animate-spin" /> In-Flight</span>;
      case 'RETRYING':
        return <span className="badge badge-retrying"><RotateCw className="w-3 h-3 animate-spin" /> Retrying ({retries}/{maxRetries})</span>;
      case 'COMPLETED':
        return <span className="badge badge-completed"><CheckCircle2 className="w-3 h-3" /> Completed</span>;
      case 'FAILED':
        return <span className="badge badge-failed"><AlertCircle className="w-3 h-3" /> Failed</span>;
      default:
        return <span className="badge bg-slate-800 text-slate-300">{status}</span>;
    }
  };

  const getTaskIcon = (type) => {
    switch (type) {
      case 'pdf_generator': return <FileText className="w-4 h-4 text-cyan-400" />;
      case 'image_processor': return <ImageIcon className="w-4 h-4 text-indigo-400" />;
      case 'data_scraper': return <Database className="w-4 h-4 text-emerald-400" />;
      case 'heavy_math': return <Cpu className="w-4 h-4 text-amber-400" />;
      case 'cron_job': return <Clock className="w-4 h-4 text-pink-400" />;
      default: return <Zap className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="glass-panel p-5 mb-6">
      
      {/* Board Header & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold font-display text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Live Task Orchestration Pipeline
          </h2>
          <p className="text-xs text-slate-400">
            Real-time status of serverless asynchronous workloads
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', 'QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filter === tab
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab === 'ALL' ? `All (${tasks.length})` : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Task List Grid */}
      <div className="mt-4 space-y-3 max-h-[560px] overflow-y-auto pr-1">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 px-4 border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
            <Zap className="w-8 h-8 text-slate-600 mx-auto mb-2 animate-bounce" />
            <h3 className="text-sm font-semibold text-slate-300">No tasks in this view</h3>
            <p className="text-xs text-slate-500 mt-1">
              Click <span className="text-cyan-400 font-semibold">+ Dispatch Task</span> above to trigger a serverless workload!
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isSelected = selectedTaskId === task.id;
            return (
              <div
                key={task.id}
                onClick={() => onSelectTask(task.id)}
                className={`glass-card p-4 cursor-pointer transition-all border ${
                  isSelected
                    ? 'border-cyan-500/60 bg-slate-900/90 shadow-lg shadow-cyan-500/10'
                    : 'border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  
                  {/* Task Identity */}
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700/60 mt-0.5">
                      {getTaskIcon(task.task_type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white font-display">
                          {task.task_name}
                        </h4>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          {task.id.slice(-6)}
                        </span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                          task.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                          task.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-300' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {task.priority}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-1.5 font-mono">
                        <span>Type: <strong className="text-slate-300">{task.task_type.replace('_', ' ')}</strong></span>
                        {task.worker_id && (
                          <span>Worker: <strong className="text-cyan-400">{task.worker_id}</strong></span>
                        )}
                        {task.execution_time_ms > 0 && (
                          <span>Duration: <strong className="text-emerald-400">{task.execution_time_ms}ms</strong></span>
                        )}
                        {task.memory_usage_mb > 0 && (
                          <span>RAM: <strong className="text-indigo-400">{task.memory_usage_mb}MB</strong></span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-3">
                    {getStatusBadge(task.status, task.retry_count, task.max_retries)}

                    {/* Result Download / Preview Actions */}
                    {task.status === 'COMPLETED' && task.result && (
                      <div className="flex items-center gap-2">
                        {task.result.downloadUrl && (
                          <a
                            href={task.result.downloadUrl}
                            download={task.result.filename || 'report.pdf'}
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 text-xs flex items-center gap-1"
                            title="Download Generated PDF Document"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Download</span>
                          </a>
                        )}

                        {task.result.previewUrl && (
                          <a
                            href={task.result.previewUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/40 text-xs flex items-center gap-1"
                            title="Preview Filtered Image"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Preview</span>
                          </a>
                        )}
                      </div>
                    )}

                    <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${isSelected ? 'rotate-90 text-cyan-400' : ''}`} />
                  </div>

                </div>

                {/* Progress Bar (Visible while Queued / Processing / Retrying) */}
                {(task.status === 'PROCESSING' || task.status === 'RETRYING' || task.status === 'QUEUED') && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span>Serverless Execution Progress</span>
                      <span className="font-mono text-cyan-400">{task.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full progress-bar-fill rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(task.progress, 5)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Error Message if Failed */}
                {task.error_message && (
                  <div className="mt-2.5 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 font-mono">
                    ⚠️ {task.error_message}
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
