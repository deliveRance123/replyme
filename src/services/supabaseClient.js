import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://wzzsldgdjrscgmjsscgn.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_ANON_KEY.includes('YOUR_'));

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false },
      realtime: { params: { eventsPerSecond: 10 } }
    })
  : null;

/**
 * Check Supabase connection health
 */
export async function testSupabaseConnection() {
  if (!supabase) return { connected: false, message: 'Supabase credentials not configured' };
  try {
    const { error } = await supabase.from('tasks').select('id').limit(1);
    if (error && error.code === '42P01') {
      return { 
        connected: true, 
        tablesReady: false, 
        message: 'Connected to Supabase! (Tables need creation via supabase_schema.sql)' 
      };
    }
    if (error) throw error;
    return { connected: true, tablesReady: true, message: 'Supabase PostgreSQL & Realtime active!' };
  } catch (err) {
    return { connected: false, error: err.message, message: 'Running in Local Resilient Mode' };
  }
}
