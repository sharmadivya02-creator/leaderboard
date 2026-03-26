import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://qbkvrpibtyluwunxvjxc.supabase.co"   // your Project URL
const supabaseAnonKey = "sb_publishable_U3qwINI0Nbo7e5vUfOjm9g_lbXnulgd" // your Anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
