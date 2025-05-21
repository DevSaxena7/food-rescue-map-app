
import { createClient } from '@supabase/supabase-js';

// Use the direct URL and key instead of environment variables
const supabaseUrl = "https://dpwwwapubtxqqfcpbdyi.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwd3d3YXB1YnR4cXFmY3BiZHlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NjU1NDAsImV4cCI6MjA2MzQ0MTU0MH0.Uy7bRuc6KjOkI92YT_lxh1FnhJk8YaKlf02sRcwsEms";

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);
