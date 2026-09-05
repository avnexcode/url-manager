import * as m from '@/generated/paraglide/messages'
import { useToastMessages } from '@/hooks'
import type { UseMutationOptions } from '@/interfaces'
import { useTRPC } from '@/lib/trpc/react'
import { publicAccessPasswordFormSchema } from '@/schemas'
import type { PublicAccessPasswordFormSchema } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'

export const usePublicIdentifierAccessPassword = (
  username: string,
  slug: string,
  { redirect = true, redirectTo, onSuccess, onError }: UseMutationOptions = {},
) => {
  const toastMessages = useToastMessages(m.model_identifier_field_password())
  const trpc = useTRPC()
  const navigate = useNavigate()

  const form = useForm<PublicAccessPasswordFormSchema>({
    defaultValues: {
      password: '',
    },
    resolver: zodResolver(publicAccessPasswordFormSchema()),
  })

  const { mutate, isPending } = useMutation(
    trpc.identifier.getPublicAccessPassword.mutationOptions({
      onSuccess: async ({ redirectUrl }) => {
        if (redirect) {
          navigate({ to: redirectUrl || redirectTo || '/{-$locale}/' })
        }
        form.reset()
        toastMessages.onApprove(true).onSuccess()
        onSuccess?.()
      },
      onError: (error) => {
        toastMessages.onApprove(true).onError(error)
        form.reset()
        onError?.()
      },
    }),
  )

  const onSubmit = async (values: PublicAccessPasswordFormSchema) => {
    mutate({ request: { ...values, username, slug } })
  }

  return { form, onSubmit, isPending }
}
