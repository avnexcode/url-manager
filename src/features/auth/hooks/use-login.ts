import * as m from '@/generated/paraglide/messages'
import { useToastMessages } from '@/hooks'
import type { UseMutationOptions } from '@/interfaces'
import { signIn } from '@/lib/supabase/auth'
import { SupabaseAuthErrorCode } from '@/lib/supabase/auth-error-code'
import { zodResolver } from '@hookform/resolvers/zod'
import type { AuthError } from '@supabase/supabase-js'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { loginFormSchema } from '../schemas'
import type { LoginFormSchema } from '../types'

export const useLogin = (
  email?: string,
  { redirect = true, redirectTo, onSuccess, onError }: UseMutationOptions = {},
) => {
  const navigate = useNavigate()
  const router = useRouter()
  const toastMessages = useToastMessages(m.model_auth_title())

  const form = useForm<LoginFormSchema>({
    defaultValues: { email: email ?? '', password: '' },
    resolver: zodResolver(loginFormSchema),
  })

  const login = async (values: LoginFormSchema) => {
    try {
      await signIn({ data: values })

      toastMessages.onLogin.onSuccess()
      onSuccess?.()

      await router.invalidate()

      if (redirect) void navigate({ to: redirectTo || '/{-$locale}/dashboard' })
    } catch (error) {
      onError?.()
      const code = (error as AuthError).code
      form.setValue('password', '')
      switch (code) {
        case SupabaseAuthErrorCode.invalid_credentials:
          toast.error(m.error_message_supabase_auth_invalid_credentials())
          break
        case SupabaseAuthErrorCode.email_not_confirmed:
          form.setError('email', {
            message: m.error_message_supabase_auth_email_not_confirmed(),
          })
          toast(m.error_message_supabase_auth_email_not_confirmed(), {
            action: {
              label: 'Verify Email',
              onClick: () =>
                navigate({
                  to: `/verify-email?email=${encodeURIComponent(form.getValues().email)}`,
                }),
            },
          })
          break
        case SupabaseAuthErrorCode.user_banned:
          toast.error(m.error_message_supabase_auth_user_banned())
          break
        case SupabaseAuthErrorCode.over_request_rate_limit:
          toast.error(m.error_message_supabase_auth_over_request_rate_limit())
          break
        case SupabaseAuthErrorCode.request_timeout:
          toast.error(m.error_message_supabase_auth_request_timeout())
          break
        case SupabaseAuthErrorCode.unexpected_failure:
          toast.error(m.error_message_supabase_auth_unexpected_failure())
          break
        default:
          toast.error(m.error_message_supabase_auth_default())
      }
    }
  }

  const onSubmit = async (values: LoginFormSchema) => {
    await login(values)
  }

  const isPending = form.formState.isSubmitting

  return { form, onSubmit, isPending }
}
