import { env } from '@/configs/env'
import { supabase } from '@/lib/supabase/client'
import { capitalizeSentence } from '@/utils'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import * as m from '@/generated/paraglide/messages'

const COOLDOWN_DURATION = 60
const STORAGE_KEY = 'email_verification_cooldown'

interface UseVerifyEmailOptions {
  email?: string
  autoCooldown?: boolean
}

export const useVerifyEmail = ({
  email: propsEmail = '',
  autoCooldown = false,
}: UseVerifyEmailOptions = {}) => {
  const [email, setEmail] = useState<string>(propsEmail)
  const [isSending, setIsSending] = useState<boolean>(false)
  const [isSendingSuccess, setIsSendingSuccess] = useState<boolean>(false)
  const [cooldownTime, setCooldownTime] = useState<number>(0)
  const [isOnCooldown, setIsOnCooldown] = useState<boolean>(false)

  useEffect(() => {
    if (propsEmail) setEmail(propsEmail)
  }, [propsEmail])

  const startCooldown = useCallback(() => {
    const cooldownEnd = Date.now() + COOLDOWN_DURATION * 1000
    localStorage.setItem(STORAGE_KEY, cooldownEnd.toString())
    setCooldownTime(COOLDOWN_DURATION)
    setIsOnCooldown(true)
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const cooldownEnd = parseInt(stored, 10)
      const now = Date.now()
      if (cooldownEnd > now) {
        setCooldownTime(Math.ceil((cooldownEnd - now) / 1000))
        setIsOnCooldown(true)
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } else if (autoCooldown) {
      startCooldown()
    }
  }, [autoCooldown, startCooldown])

  useEffect(() => {
    if (!isOnCooldown || cooldownTime <= 0) return

    const interval = setInterval(() => {
      setCooldownTime((prev) => {
        if (prev <= 1) {
          setIsOnCooldown(false)
          localStorage.removeItem(STORAGE_KEY)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isOnCooldown, cooldownTime])

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`
  }, [])

  const sendVerification = useCallback(
    async (emailOverride?: string) => {
      if (isOnCooldown) {
        toast.error(
          capitalizeSentence(
            m.error_message_resend_cooldown({ seconds: cooldownTime }),
          ),
        )
        return
      }

      const emailToUse = emailOverride ?? email

      if (!emailToUse.trim()) {
        toast.error(
          capitalizeSentence(
            m.schema_validation_common_required({
              field: m.model_auth_field_email(),
            }),
          ),
        )
        return
      }

      try {
        setIsSending(true)

        const { error: resendError } = await supabase.auth.resend({
          type: 'signup',
          email: emailToUse,
          options: {
            emailRedirectTo: `${env.VITE_BASE_URL}/auth/callback`,
          },
        })

        if (resendError) {
          console.error('Resend verification error:', resendError)
          switch (resendError.message) {
            case 'User not found':
              toast.error(
                capitalizeSentence(
                  m.error_message_supabase_auth_user_not_found(),
                ),
              )
              break
            case 'Email rate limit exceeded':
              toast.error(
                capitalizeSentence(
                  m.error_message_supabase_auth_over_email_send_rate_limit(),
                ),
              )
              break
            case 'Invalid email':
              toast.error(
                capitalizeSentence(m.schema_validation_string_email()),
              )
              break
            case 'Email already confirmed':
              toast.error(
                capitalizeSentence(
                  m.error_message_supabase_auth_email_already_confirmed(),
                ),
              )
              break
            default:
              console.error(resendError.message)
              toast.error(
                capitalizeSentence(
                  m.error_message_supabase_auth_unexpected_failure(),
                ),
              )
          }
          return
        }

        startCooldown()
        setIsSendingSuccess(true)
        toast.success(
          capitalizeSentence(m.success_message_send_verification_email()),
        )
        setTimeout(() => setIsSendingSuccess(false), 5000)
      } catch (error) {
        if (error instanceof Error) {
          console.error(`An error occurred: ${error.message}`)
        } else {
          toast.error(
            capitalizeSentence(
              m.error_message_supabase_auth_unexpected_failure(),
            ),
          )
        }
      } finally {
        setIsSending(false)
      }
    },
    [cooldownTime, email, isOnCooldown, startCooldown],
  )

  return {
    email,
    setEmail,
    isSending,
    isSendingSuccess,
    isOnCooldown,
    cooldownTime,
    sendVerification,
    formatTime,
  }
}
