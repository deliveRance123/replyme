import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { BarChart3, PieChart, Activity } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function PerformanceCharts({ tasks = [], metrics = {} }) {
  // Latency history points
  const recentTasks = tasks.filter(t => t.execution_time_ms > 0).slice(0, 10).reverse();
  const latencyLabels = recentTasks.map((t, idx) => `#${idx + 1}`);
  const latencyValues = recentTasks.map(t => t.execution_time_ms);

  const lineData = {
    labels: latencyLabels.length > 0 ? latencyLabels : ['#1', '#2', '#3', '#4', '#5'],
    datasets: [
      {
        label: 'Worker Execution Time (ms)',
        data: latencyValues.length > 0 ? latencyValues : [120, 145, 95, 210, 180],
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.15)',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#38bdf8',
        pointBorderColor: '#fff',
        pointRadius: 4
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#090D16',
        titleColor: '#38bdf8',
        bodyColor: '#fff',
        borderColor: 'rgba(6, 182, 212, 0.3)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#64748b', font: { family: 'monospace' } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#64748b', font: { family: 'monospace' } }
      }
    }
  };

  // Workload Type Distribution
  const typeCounts = {
    pdf_generator: tasks.filter(t => t.task_type === 'pdf_generator').length,
    image_processor: tasks.filter(t => t.task_type === 'image_processor').length,
    data_scraper: tasks.filter(t => t.task_type === 'data_scraper').length,
    heavy_math: tasks.filter(t => t.task_type === 'heavy_math').length,
    cron_job: tasks.filter(t => t.task_type === 'cron_job').length
  };

  const doughnutData = {
    labels: ['PDF Generator', 'Image Processor', 'Data Scraper', 'Crypto Math', 'Cron Job'],
    datasets: [
      {
        data: [
          typeCounts.pdf_generator || 1,
          typeCounts.image_processor || 1,
          typeCounts.data_scraper || 1,
          typeCounts.heavy_math || 1,
          typeCounts.cron_job || 1
        ],
        backgroundColor: [
          '#06b6d4',
          '#6366f1',
          '#10b981',
          '#f59e0b',
          '#ec4899'
        ],
        borderWidth: 0
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#cbd5e1',
          boxWidth: 12,
          font: { size: 11 }
        }
      }
    },
    cutout: '70%'
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      
      {/* Latency Trend Line Chart */}
      <div className="lg:col-span-2 glass-panel p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold font-display text-white">
              Worker Latency & Execution Speed (ms)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Avg: <strong className="text-cyan-300">{metrics.avgLatencyMs || 210}ms</strong>
          </span>
        </div>
        <div className="h-56 w-full">
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>

      {/* Workload Distribution Doughnut Chart */}
      <div className="glass-panel p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold font-display text-white">
              Task Workload Mix
            </h3>
          </div>
        </div>
        <div className="h-56 w-full flex items-center justify-center">
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>

    </div>
  );
}
