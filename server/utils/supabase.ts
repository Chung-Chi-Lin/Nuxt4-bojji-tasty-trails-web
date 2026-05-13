import { createClient } from '@supabase/supabase-js'

/** 用 Publishable key（anon）— 適合一般 auth 操作 */
export function getSupabaseClient() {
  const config = useRuntimeConfig()
  return createClient(config.public.supabaseUrl, config.public.supabasePublishableKey)
}

/** 用 Secret key（service_role）— 可繞過 RLS，只在 server 用 */
export function getSupabaseAdmin() {
  const config = useRuntimeConfig()
  return createClient(config.public.supabaseUrl, config.supabaseSecretKey)
}
