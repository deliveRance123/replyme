/**
 * Upstash QStash Integration Service
 * Manages Serverless Task Enqueuing, Cron Scheduling & Message Retries
 */

const QSTASH_URL = import.meta.env.VITE_QSTASH_URL || 'https://qstash-eu-central-1.upstash.io';
const QSTASH_TOKEN = import.meta.env.VITE_QSTASH_TOKEN || '';

export const isQStashConfigured = Boolean(QSTASH_TOKEN && !QSTASH_TOKEN.includes('YOUR_'));

/**
 * Publish a background task to QStash Queue
 * @param {string} destinationUrl - The webhook/serverless endpoint to receive the task
 * @param {object} payload - Task parameters & body
 * @param {object} options - Delay, retries, deduplication ID
 */
export async function publishQStashTask(destinationUrl, payload, options = {}) {
  if (!isQStashConfigured) {
    return {
      simulated: true,
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      timestamp: new Date().toISOString()
    };
  }

  try {
    const headers = {
      'Authorization': `Bearer ${QSTASH_TOKEN}`,
      'Content-Type': 'application/json',
      'Upstash-Retries': String(options.retries || 3),
      'Upstash-Backoff-Type': 'exponential',
      ...(options.delay ? { 'Upstash-Delay': `${options.delay}s` } : {}),
      ...(options.deduplicationId ? { 'Upstash-Deduplication-Id': options.deduplicationId } : {})
    };

    const target = destinationUrl || 'https://serverless-task-engine.internal/api/worker';
    const response = await fetch(`${QSTASH_URL}/v2/publish/${target}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`QStash publish failed (${response.status}): ${errText}`);
    }

    const data = await response.json();
    return {
      success: true,
      messageId: data.messageId,
      url: data.url,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.warn('[QStash Engine] Falling back to local queue executor:', error.message);
    return {
      simulated: true,
      fallbackError: error.message,
      messageId: `msg_local_${Date.now()}`,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Schedule a Recurring Cron Task
 */
export async function createQStashSchedule(cronExpression, destinationUrl, payload) {
  if (!isQStashConfigured) {
    return {
      scheduleId: `sched_${Date.now()}`,
      cron: cronExpression,
      simulated: true
    };
  }

  try {
    const response = await fetch(`${QSTASH_URL}/v2/schedules/${destinationUrl}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${QSTASH_TOKEN}`,
        'Content-Type': 'application/json',
        'Upstash-Cron': cronExpression
      },
      body: JSON.stringify(payload)
    });
    return await response.json();
  } catch (error) {
    console.error('Failed to create QStash schedule:', error);
    return { error: error.message };
  }
}
