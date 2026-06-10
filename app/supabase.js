import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nfbrxzsjaxveypropzzi.supabase.co'
const supabaseKey = 'sb_publishable_ZS1GYeiNgFHyM3xrwjm0-w_o8mooA0y'

export const supabase = createClient(supabaseUrl, supabaseKey)