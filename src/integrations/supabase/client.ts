// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://rtwspqivpnjszjvjspbw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0d3NwcWl2cG5qc3pqdmpzcGJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0MjM0MjAsImV4cCI6MjA1Mzk5OTQyMH0.MNqXrNSC6UuI05WDkrXn4ckd-6Xm2P8xpqGX20Xfd1A";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);