import * as m from '@/generated/paraglide/messages'
import { useToastMessages } from '@/hooks'
import type { UseMutationOptions } from '@/interfaces'
import { useTRPC } from '@/lib/trpc/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { createUpdatePasswordFormSchema } from '../schemas'
import type { UpdatePasswordFormSchema } from '../types'
import type { LoginProvider } from '@/generated/prisma/enums'

export const useUpdatePassword = (
  providers: LoginProvider[],
  { redirect = true, redirectTo, onSuccess, onError }: UseMutationOptions = {},
) => {
  const toastMessages = useToastMessages(m.model_auth_field_password())
  const trpc = useTRPC()
  const navigate = useNavigate()

  const form = useForm<UpdatePasswordFormSchema>({
    defaultValues: {
      currentPassword: '',
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(createUpdatePasswordFormSchema(providers)),
  })

  const { mutate, isPending } = useMutation(
    trpc.auth.updatePassword.mutationOptions({
      onSuccess: async () => {
        if (redirect) {
          void navigate({ to: redirectTo || '/{-$locale}/dashboard/platform' })
        }
        form.reset()
        toastMessages.onUpdate.onSuccess()
        onSuccess?.()
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
