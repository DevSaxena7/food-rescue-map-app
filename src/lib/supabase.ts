
import { createClient } from '@supabase/supabase-js';

// Use the direct URL and key instead of environment variables
const supabaseUrl = "https://dpwwwapubtxqqfcpbdyi.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwd3d3YXB1YnR4cXFmY3BiZHlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NjU1NDAsImV4cCI6MjA2MzQ0MTU0MH0.Uy7bRuc6KjOkI92YT_lxh1FnhJk8YaKlf02sRcwsEms";

// Create and export the Supabase client with proper configuration
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Auth state cleanup utility for preventing "limbo" states
export const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};
