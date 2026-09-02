import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Image as ImageIcon, 
  Database, 
  Cpu, 
  Clock, 
  Zap, 
  Sparkles,
  Sliders,
  Code
} from 'lucide-react';
import { submitTask } from '../services/taskWorkerEngine';

const TASK_TEMPLATES = [
  {
    id: 'pdf_generator',
    name: 'PDF Performance Report',
    icon: FileText,
    color: 'from-cyan-500 to-blue-600',
    description: 'Compiles formatted data tables into downloadable PDF document with vector formatting.',
    defaultPayload: {
      title: 'Cloud Distributed Task Performance Report',
      author: 'Student System Architect',
      includeCharts: true,
      maxRows: 50
    }
  },
  {
    id: 'image_processor',
    name: 'Image Processing & Filters',
    icon: ImageIcon,
    color: 'from-indigo-500 to-purple-600',
    description: 'Applies image transformations (grayscale, contrast, cyber glow, compression) asynchronously.',
    defaultPayload: {
      filter: 'CYBER_NEON_VIBE',
      targetResolution: '1920x1080',
      compressionQuality: 85,
      outputFormat: 'image/png'
    }
  },
  {
    id: 'data_scraper',
    name: 'Big Data Aggregator',
    icon: Database,
    color: 'from-emerald-500 to-teal-600',
    description: 'Scrapes and aggregates 1,250 records, calculating statistical percentiles and anomalies.',
    defaultPayload: {
      endpoint: 'https://api.cloud-telemetry.io/v1/clusters',
      batchSize: 1250,
      computePercentiles: ['p50', 'p95', 'p99']
    }
  },
  {
    id: 'heavy_math',
    name: 'Crypto & Matrix Simulation',
    icon: Cpu,
    color: 'from-amber-500 to-orange-600',
    description: 'Executes heavy matrix operations and cryptographic proof-of-work without blocking browser thread.',
    defaultPayload: {
      iterations: 1000000,
      matrixSize: 256,
      algorithm: 'SHA-256 Eigenvector Solver'
    }
  },
  {
    id: 'cron_job',
    name: 'Scheduled Health Ping',
    icon: Clock,
    color: 'from-pink-500 to-rose-600',
    description: 'Automated periodic health check and cluster connectivity probe.',
    defaultPayload: {
      scheduleInterval: '5m',
      targetService: 'Supabase + QStash Clusters',
      alertOnFailure: true
    }
  }
];

export default function TaskSubmitModal({ isOpen, onClose }) {
  const [selectedType, setSelectedType] = useState('pdf_generator');
  const [taskName, setTaskName] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [payloadText, setPayloadText] = useState(
    JSON.stringify(TASK_TEMPLATES[0].defaultPayload, null, 2)
  );
  const [batchCount, setBatchCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSelectTemplate = (tpl) => {
    setSelectedType(tpl.id);
    setTaskName(`${tpl.name} #${Math.floor(Math.random() * 900 + 100)}`);
    setPayloadText(JSON.stringify(tpl.defaultPayload, null, 2));
  };

  const handleDispatch = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let parsedPayload = {};
    try {
      parsedPayload = JSON.parse(payloadText);
    } catch {
      parsedPayload = { raw: payloadText };
    }

    const baseName = taskName.trim() || `${TASK_TEMPLATES.find(t => t.id === selectedType)?.name || 'Task'}`;

    // Support submitting multiple concurrent tasks to demonstrate auto-scaling
    for (let i = 0; i < batchCount; i++) {
      await submitTask({
        name: batchCount > 1 ? `${baseName} (Batch #${i + 1})` : baseName,
        type: selectedType,
        priority,
        payload: parsedPayload
      });
    }

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel-glow w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative border border-cyan-500/30">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-white">
              Dispatch Serverless Task
            </h2>
            <p className="text-xs text-slate-400">
              Select a workload template or construct a custom asynchronous event
            </p>
          </div>
        </div>

        <form onSubmit={handleDispatch} className="space-y-5">
          
          {/* Workload Template Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
              1. Select Task Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {TASK_TEMPLATES.map((tpl) => {
                const IconComponent = tpl.icon;
                const isSelected = selectedType === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => handleSelectTemplate(tpl)}
                    className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-400/60 shadow-lg shadow-cyan-500/10'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className={`p-1.5 rounded-lg bg-gradient-to-r ${tpl.color} text-white`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className={`text-xs font-bold ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                        {tpl.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {tpl.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Task Name & Priority Configuration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Task Label
              </label>
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="e.g. Branded PDF Audit Report"
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>

          {/* Concurrent Batch Spikes (To showcase auto-scaling to examiners) */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div>
              <span className="text-xs font-semibold text-slate-200 block">Demonstrate Elastic Burst (Concurrency)</span>
              <span className="text-[11px] text-slate-400">Spawn multiple tasks at once to show automatic horizontal scaling</span>
            </div>
            <div className="flex items-center gap-2">
              {[1, 3, 5].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setBatchCount(num)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                    batchCount === num
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/30'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {num}x Task{num > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* JSON Payload Editor */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-cyan-400" />
                Payload Parameters (JSON)
              </label>
              <span className="text-[10px] text-slate-500 font-mono">Passed to serverless handler</span>
            </div>
            <textarea
              rows={4}
              value={payloadText}
              onChange={(e) => setPayloadText(e.target.value)}
              className="w-full bg-[#050811] border border-slate-700/80 rounded-lg p-3 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary text-xs"
            >
              <Zap className="w-4 h-4" />
              <span>{isSubmitting ? 'Enqueuing...' : `Dispatch ${batchCount > 1 ? `${batchCount} Tasks` : 'Task'}`}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
