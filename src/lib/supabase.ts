import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kmmnlswbxrbwuzpuzrwg.supabase.co';
const supabaseAnonKey =
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttbW5sc3dieHJid3V6cHV6cndnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5ODU4MzAsImV4cCI6MjA4OTU2MTgzMH0.2eWeamb53szu3_gOhBPCT3t7PxW6K3YckF2fvM4Kurw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);