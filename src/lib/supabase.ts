
import { createClient } from '@supabase/supabase-js';

// Ensure the environment variables have fallback values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Add validation to provide helpful error messages
if (!supabaseUrl) {
  console.error('VITE_SUPABASE_URL is not defined in your environment variables');
}

if (!supabaseKey) {
  console.error('VITE_SUPABASE_ANON_KEY is not defined in your environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
