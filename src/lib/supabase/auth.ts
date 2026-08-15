import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { createSSRClient } from './server'

export const fetchUser = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = createSSRClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  return {
    id: user.id,
    email: user.email,
    username: user.user_metadata.username,
  }
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

/**
 * Server function untuk login via Supabase.
 * Mengelola sesi dan cookie secara server-side agar cookie HttpOnly
 * dapat diset dengan aman tanpa manipulasi di browser.
 */
export const loginServerFn = createServerFn({ method: 'POST' })
  .validator(loginSchema)
  .handler(async ({ data }) => {
    const supabase = createSSRClient()

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      throw error
    }

    return { success: true }
  })

/**
 * Server function untuk logout via Supabase.
 * Menghapus sesi di server dan cookie melalui Supabase SSR client,
 * menggantikan pendekatan `clearStorage()` + looping `document.cookie` manual di browser.
 */
export const logoutServerFn = createServerFn({ method: 'POST' }).handler(
  async () => {
    const supabase = createSSRClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
      throw error
    }

    return { success: true }
  },
)
