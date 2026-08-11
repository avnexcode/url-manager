import * as m from '@/generated/paraglide/messages'
import { useToastMessages } from '@/hooks'
import { useTRPC } from '@/integrations/trpc/react'
import type { UseMutationOptions } from '@/interfaces'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { registerFormSchema } from '../schemas'
import type { RegisterFormSchema } from '../types'

// { redirect = true, redirectTo, onSuccess, onError }: UseMutationOptions = {}

export const useRegister = () => {
  const defaultUrl = '/verify-email'
  const router = useRouter()
  const toastMessages = useToastMessages(m.model_auth_title())
  const trpc = useTRPC()

  const form = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  // const { mutate, isPending } = useMutation(
  //   trpc.auth.register.mutationOption({
  //     onSuccess: (data, variables) => {
  //       if (redirect) void router.push(redirectTo || '/')
  //       toastMessages.onRegister.onSuccess()
  //       onSuccess?.()
  //     },
  //     onError: (error) => {
  //       form.setValue('password', '')
  //       form.setValue('confirmPassword', '')
  //       toastMessages.onRegister.onError(error)
  //       onError?.()
  //     },
  //   }),
  // )

  const onSubmit = (values: RegisterFormSchema) => {
    console.log({ request: values })
  }

  const isPending = false

  return { form, onSubmit, isPending, defaultUrl }
}
