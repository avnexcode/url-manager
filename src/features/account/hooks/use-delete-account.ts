import * as m from '@/generated/paraglide/messages'
import { useToastMessages } from '@/hooks'
import type { UseMutationOptions } from '@/interfaces'
import { useTRPC } from '@/lib/trpc/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { deleteAccountFormSchema } from '../schemas'
import type { DeleteAccountFormSchema } from '../types'

export const useDeleteAccount = ({
  redirect = true,
  redirectTo,
  onSuccess,
  onError,
}: UseMutationOptions = {}) => {
  const toastMessages = useToastMessages(m.model_user_title())
  const trpc = useTRPC()
  const navigate = useNavigate()

  const form = useForm<DeleteAccountFormSchema>({
    defaultValues: {
      password: '',
    },
    resolver: zodResolver(deleteAccountFormSchema),
  })

  const { mutate, isPending } = useMutation(
    trpc.auth.deleteAccount.mutationOptions({
      onSuccess: async () => {
        if (redirect) {
          void navigate({ to: redirectTo || '/{-$locale}/dashboard/platform' })
        }
        form.reset()
        toastMessages.onDelete.onSuccess()
        onSuccess?.()
      },
      onError: (error) => {
        form.reset()
        toastMessages.onDelete.onError(error)
        onError?.()
      },
    }),
  )

  const onSubmit = async (values: DeleteAccountFormSchema) => {
    mutate({ request: values })
  }

  return { form, onSubmit, isPending: isPending }
}
