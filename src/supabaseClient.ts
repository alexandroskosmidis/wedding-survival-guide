import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Λείπουν τα VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Δημιούργησε ένα αρχείο .env βασισμένο στο .env.example.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
