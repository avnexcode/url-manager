import * as m from '@/generated/paraglide/messages'
import { useToastMessages } from '@/hooks'
import type { UseMutationOptions } from '@/interfaces'
import { signOut } from '@/lib/supabase/auth'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { useState } from 'react'

export const clearClientStorage = () => {
  if (typeof window === 'undefined') return

  window.localStorage.clear()
  window.sessionStorage.clear()

  document.cookie.split(';').forEach((cookie) => {
    const name = cookie.split('=')[0]?.trim()
    if (!name) return

    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`
  })
}

export const useLogout = ({
  redirect = true,
  redirectTo,
  onSuccess,
  onError,
}: UseMutationOptions = {}) => {
  const navigate = useNavigate()
  const router = useRouter()
  const toastMessages = useToastMessages(m.model_auth_title())
  const [isPending, setIsPending] = useState<boolean>(false)

  const logout = async () => {
    try {
      setIsPending(true)

      await signOut()
      clearClientStorage()

      await router.invalidate()

      if (redirect) void navigate({ to: redirectTo || '/{-$locale}/login' })

      toastMessages.onLogout.onSuccess()
      onSuccess?.()
    } catch (error) {
      if (error) {
        toastMessages.onLogout.onError(error as { message: string })
        onError?.()
      }
    } finally {
      setIsPending(false)
    }
  }

  const handleLogout = async () => {
    await logout()
  }

  return { logout, handleLogout, isPending }
}
