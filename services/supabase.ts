import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://enrihpyrfelscyolfvyv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVucmlocHlyZmVsc2N5b2xmdnl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4ODYxNjAsImV4cCI6MjA4NjQ2MjE2MH0.adBIG7b0EQ5mOP9sC3g31O2h_H-6njRfPKJNXQeXCw4';

export const supabase = createClient(supabaseUrl, supabaseKey);