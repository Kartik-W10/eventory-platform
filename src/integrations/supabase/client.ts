
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Replace these with your new Supabase project credentials
const SUPABASE_URL = "YOUR_NEW_SUPABASE_PROJECT_URL";
const SUPABASE_PUBLISHABLE_KEY = "YOUR_NEW_SUPABASE_ANON_KEY";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
