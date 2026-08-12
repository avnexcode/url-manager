import * as m from '@/generated/paraglide/messages'
import { useToastMessages } from '@/hooks'
import type { UseMutationOptions } from '@/interfaces'
import { supabase } from '@/lib/supabase/client'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

export const clearStorage = () => {
  localStorage.clear()
  sessionStorage.clear()
  document.cookie.split(';').forEach((cookie) => {
    const name = cookie.split('=')[0]?.trim()
    if (name) {
      document.cookie = `${name}=;expires=${new Date(0).toUTCString()};path=/`
    }
  })
}

export const useLogout = ({
  redirect = true,
  redirectTo,
  onSuccess,
  onError,
}: UseMutationOptions = {}) => {
  const defaultUrl = '/login'
  const navigate = useNavigate()
  const toastMessages = useToastMessages(m.model_auth_title())
  const [isPending, setIsPending] = useState<boolean>(false)

  const logout = async () => {
    try {
      setIsPending(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      clearStorage()
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

  return { logout, isPending, defaultUrl }
}
