import { env } from '@/configs/env'
import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
  return createBrowserClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY)
}

export const supabase = createClient()
