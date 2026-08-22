import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { createSSRClient } from './server'

export const getUser = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = createSSRClient()

  const { data } = await supabase.auth.getUser()

  if (!data.user) return null

  const { user } = data

  return {
    id: user.id,
    email: user.email,
    username: user.user_metadata.username,
  }
})

export const signIn = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      email: z.email(),
      password: z.string().min(8),
    }),
  )
  .handler(async ({ data: { email, password } }) => {
    const supabase = createSSRClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    return { success: true }
  })

export const signOut = createServerFn({ method: 'POST' }).handler(async () => {
  const supabase = createSSRClient()

  const { error } = await supabase.auth.signOut()

  if (error) throw error

  return { success: true }
})
