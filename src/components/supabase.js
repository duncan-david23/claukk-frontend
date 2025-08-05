import { createClient } from '@supabase/supabase-js'



const SUPABASE_URL = "https://ckjifoqfavfqpyzphkvj.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNramlmb3FmYXZmcXB5enBoa3ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMDk1NzUsImV4cCI6MjA2ODU4NTU3NX0.U4V1EqTEvoORKytXHFlpvOHDJBw5pc_RQgLKh_v54qU"



export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)