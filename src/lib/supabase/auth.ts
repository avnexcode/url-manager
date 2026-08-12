// src/server/auth.ts
import { createServerFn } from '@tanstack/react-start'
import { createSSRClient } from './server'

export type UserRole = 'admin' | 'customer'

export const fetchUser = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = createSSRClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  return {
    id: user.id,
    email: user.email,
    role: user.app_metadata.role as UserRole,
  }
})
