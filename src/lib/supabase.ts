import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://cnjvgwdeehexhlpqjixl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuanZnd2RlZWhleGhscHFqaXhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNDUzOTksImV4cCI6MjEwMzgyMTM5OX0.QWNTZe-FPn85jF2CSvD0lXA2z1uM9BFur_LEpy6EU1A"; // Pega la key del Paso 1

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);