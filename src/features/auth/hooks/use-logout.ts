import * as m from '@/generated/paraglide/messages'
import { useToastMessages } from '@/hooks'
import type { UseMutationOptions } from '@/interfaces'
import { logoutServerFn } from '@/lib/supabase/auth'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { useState } from 'react'

export const useLogout = ({
  redirect = true,
  redirectTo,
  onSuccess,
  onError,
}: UseMutationOptions = {}) => {
  const defaultUrl = '/login'
  const navigate = useNavigate()
  const router = useRouter()
  const toastMessages = useToastMessages(m.model_auth_title())
  const [isPending, setIsPending] = useState<boolean>(false)

  const logout = async () => {
    try {
      setIsPending(true)

      await logoutServerFn()

      await router.invalidate()

      if (redirect) void navigate({ to: redirectTo || defaultUrl })

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

  return { logout, handleLogout, isPending, defaultUrl }
}
