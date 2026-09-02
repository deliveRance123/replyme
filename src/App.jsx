import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ArchitectureHero from './components/ArchitectureHero';
import MetricsCards from './components/MetricsCards';
import PerformanceCharts from './components/PerformanceCharts';
import TaskBoard from './components/TaskBoard';
import TerminalConsole from './components/TerminalConsole';
import TaskSubmitModal from './components/TaskSubmitModal';
import TaskDetailsModal from './components/TaskDetailsModal';
import DeadLetterQueueModal from './components/DeadLetterQueueModal';
import ThreeBackground from './components/ThreeBackground';
import { subscribeToEngine, submitTask } from './services/taskWorkerEngine';

export default function App() {
  const [engineState, setEngineState] = useState({
    tasks: [],
    logs: [],
    dlq: [],
    metrics: {
      totalSubmitted: 0,
      totalCompleted: 0,
      totalFailed: 0,
      totalRetried: 0,
      avgLatencyMs: 0,
      latencies: []
    }
  });

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isDlqModalOpen, setIsDlqModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // Subscribe to live background task engine state
  useEffect(() => {
    const unsubscribe = subscribeToEngine((state) => {
      setEngineState(state);
    });

    // Seed initial demo task so the dashboard is immediately interactive
    const seedTimer = setTimeout(() => {
      submitTask({
        name: 'Initial System Verification Audit',
        type: 'pdf_generator',
        priority: 'HIGH',
        payload: {
          title: 'Cloud-Based Serverless System Health & Telemetry Verification',
          author: 'Automated Cloud Health Prober'
        }
      });
    }, 800);

    return () => {
      unsubscribe();
      clearTimeout(seedTimer);
    };
  }, []);

  const activeTaskCount = engineState.tasks.filter(
    (t) => t.status === 'PROCESSING' || t.status === 'RETRYING'
  ).length;

  const selectedTask = engineState.tasks.find((t) => t.id === selectedTaskId);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#060913] text-slate-100 overflow-x-hidden selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Interactive 3D Serverless Network Background */}
      <ThreeBackground activeTaskCount={activeTaskCount} />

      {/* Top Navigation */}
      <Navbar
        onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
        onOpenDlqModal={() => setIsDlqModalOpen(true)}
        dlqCount={engineState.dlq.length}
      />

      {/* Main Dashboard Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 relative z-10">
        
        {/* Project Architecture Showcase Banner */}
        <ArchitectureHero />

        {/* Telemetry Metric Cards */}
        <MetricsCards
          tasks={engineState.tasks}
          metrics={engineState.metrics}
          dlqCount={engineState.dlq.length}
        />

        {/* Real-Time Performance Analytics & Latency Charts */}
        <PerformanceCharts
          tasks={engineState.tasks}
          metrics={engineState.metrics}
        />

        {/* Main Content: Task Orchestration Board & Live Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Task Board (7 cols) */}
          <div className="lg:col-span-7">
            <TaskBoard
              tasks={engineState.tasks}
              onSelectTask={(id) => setSelectedTaskId(id)}
              selectedTaskId={selectedTaskId}
            />
          </div>

          {/* Terminal Console (5 cols) */}
          <div className="lg:col-span-5">
            <TerminalConsole
              logs={engineState.logs}
              selectedTaskId={selectedTaskId}
            />
          </div>

        </div>

      </main>

      {/* Modals */}
      <TaskSubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />

      <DeadLetterQueueModal
        isOpen={isDlqModalOpen}
        onClose={() => setIsDlqModalOpen(false)}
        dlqTasks={engineState.dlq}
      />

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTaskId(null)}
        />
      )}

      {/* Footer with Academic Note */}
      <footer className="border-t border-slate-800/80 bg-[#050811] py-4 text-center text-xs text-slate-500 relative z-10">
        <p>
          Cloud-Based Serverless Task Processing System • Developed for Academic Project Defense & Verification
        </p>
      </footer>

    </div>
  );
}
