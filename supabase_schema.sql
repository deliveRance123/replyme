-- ==========================================================
-- CLOUD-BASED SERVERLESS TASK PROCESSING SYSTEM
-- Database Schema for Supabase PostgreSQL
-- ==========================================================

-- 1. Tasks Table (Core metadata & state tracking)
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_name TEXT NOT NULL,
    task_type TEXT NOT NULL CHECK (task_type IN ('pdf_generator', 'image_processor', 'data_scraper', 'heavy_math', 'cron_job')),
    status TEXT NOT NULL DEFAULT 'QUEUED' CHECK (status IN ('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED', 'RETRYING', 'CANCELLED')),
    priority TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    progress INT NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    payload JSONB DEFAULT '{}'::jsonb,
    result JSONB DEFAULT '{}'::jsonb,
    retry_count INT DEFAULT 0,
    max_retries INT DEFAULT 3,
    error_message TEXT,
    worker_id TEXT,
    execution_time_ms INT DEFAULT 0,
    memory_usage_mb NUMERIC(6,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Task Logs Table (Realtime telemetry & step-by-step audit)
CREATE TABLE IF NOT EXISTS public.task_logs (
    id BIGSERIAL PRIMARY KEY,
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    level TEXT NOT NULL CHECK (level IN ('INFO', 'WARN', 'ERROR', 'SUCCESS', 'DEBUG')),
    message TEXT NOT NULL,
    step_number INT DEFAULT 1,
    details JSONB DEFAULT '{}'::jsonb,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Dead-Letter Queue (DLQ for unrecoverable failed tasks)
CREATE TABLE IF NOT EXISTS public.dead_letter_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    failure_reason TEXT NOT NULL,
    stack_trace TEXT,
    payload JSONB,
    attempts INT DEFAULT 3,
    archived_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Worker Metrics (Throughput, Latency, Concurrency)
CREATE TABLE IF NOT EXISTS public.worker_metrics (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    active_workers INT DEFAULT 0,
    queue_depth INT DEFAULT 0,
    avg_latency_ms INT DEFAULT 0,
    success_rate NUMERIC(5,2) DEFAULT 100.0,
    throughput_per_min INT DEFAULT 0
);

-- Enable Row Level Security (RLS) & Public Policies for Demo/Student Access
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dead_letter_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public all access on tasks" ON public.tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all access on task_logs" ON public.task_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all access on dlq" ON public.dead_letter_queue FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all access on metrics" ON public.worker_metrics FOR ALL USING (true) WITH CHECK (true);

-- Enable Supabase Realtime for live dashboard streaming
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.task_logs;
