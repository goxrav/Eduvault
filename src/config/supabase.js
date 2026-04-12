import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lhvsbikakkyuxogmcnif.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxodnNiaWtha2t5dXhvZ21jbmlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MTc3NTEsImV4cCI6MjA5MDI5Mzc1MX0.hUh2ulTWNiuYJ3-UFKUeuYukej_hVkpDzUAp3xvqDjg'

export const supabase = createClient(supabaseUrl, supabaseKey)