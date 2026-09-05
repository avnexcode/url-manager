import { useLogout } from '@/features/auth/hooks'
import * as m from '@/generated/paraglide/messages'
import type { LoginProvider } from '@/generated/prisma/enums'
import { useToastMessages } from '@/hooks'
import type { UseMutationOptions } from '@/interfaces'
import { useTRPC } from '@/lib/trpc/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { updatePasswordFormSchema } from '../schemas'
import type { UpdatePasswordFormSchema } from '../types'

export const useUpdatePassword = (
  providers: LoginProvider[],
  { redirect = true, redirectTo, onSuccess, onError }: UseMutationOptions = {},
) => {
  const toastMessages = useToastMessages(m.model_auth_field_password())
  const trpc = useTRPC()
  const navigate = useNavigate()
  const { logout } = useLogout()

  const form = useForm<UpdatePasswordFormSchema>({
    defaultValues: {
      currentPassword: '',
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(updatePasswordFormSchema(providers)),
  })

  const { mutate, isPending } = useMutation(
    trpc.auth.updatePassword.mutationOptions({
      onSuccess: async () => {
        if (redirect) {
          void navigate({ to: redirectTo || '/{-$locale}/login' })
        }
        form.reset()
        toastMessages.onUpdate.onSuccess()
        onSuccess?.()
        await logout()
      },
      onError: (error) => {
        form.reset()
        toastMessages.onUpdate.onError(error)
        onError?.()
      },
    }),
  )

  const onSubmit = async (values: UpdatePasswordFormSchema) => {
    mutate({ request: values })
  }

  return { form, onSubmit, isPending: isPending }
}
