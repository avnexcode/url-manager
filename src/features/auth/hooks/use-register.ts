import * as m from '@/generated/paraglide/messages'
import { useToastMessages } from '@/hooks'
import { useTRPC } from '@/lib/trpc/react'
import type { UseMutationOptions } from '@/interfaces'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { registerFormSchema } from '../schemas'
import type { RegisterFormSchema } from '../types'

export const useRegister = ({
  redirect = true,
  redirectTo,
  onSuccess,
  onError,
}: UseMutationOptions = {}) => {
  const toastMessages = useToastMessages(m.model_auth_title())
  const trpc = useTRPC()
  const navigate = useNavigate()

  const form = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema()),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const { mutate, isPending } = useMutation(
    trpc.auth.register.mutationOptions({
      onSuccess: () => {
        if (redirect) void navigate({ to: redirectTo || '/{-$locale}/login' })
        toastMessages.onRegister.onSuccess()
        onSuccess?.()
      },
      onError: (error) => {
        form.setValue('password', '')
        form.setValue('confirmPassword', '')
        toastMessages.onRegister.onError(error)
        onError?.()
      },
    }),
  )

  const onSubmit = (values: RegisterFormSchema) => {
    mutate({ request: values })
  }

  return { form, onSubmit, isPending }
}
