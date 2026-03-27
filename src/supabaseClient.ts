import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iccpmxqixktekwmcrokf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljY3BteHFpeGt0ZWt3bWNyb2tmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNjUwNjMsImV4cCI6MjA4OTk0MTA2M30.4G30EieL5aqPRzFUfvt6TCROA0gRPRN2kU5WVJ0bONc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
