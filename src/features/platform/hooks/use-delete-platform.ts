import * as m from '@/generated/paraglide/messages'
import { useToastMessages } from '@/hooks'
import type { UseMutationOptions } from '@/interfaces'
import { useTRPC } from '@/lib/trpc/react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

export const useDeletePlatform = ({
  redirect = true,
  redirectTo,
  onSuccess,
  onError,
}: UseMutationOptions = {}) => {
  const toastMessages = useToastMessages(m.model_platform_title())
  const trpc = useTRPC()
  const navigate = useNavigate()

  const { mutate, isPending } = useMutation(
    trpc.platform.delete.mutationOptions({
      onSuccess: () => {
        if (redirect) {
          void navigate({ to: redirectTo || '/{-$locale}/dashboard/platform' })
        }
        toastMessages.onDelete.onSuccess()
        onSuccess?.()
      },
      onError: (error) => {
        toastMessages.onDelete.onError(error)
        onError?.()
      },
    }),
  )

  const onDelete = (values: { id: string }) => {
    mutate({ request: { id: values.id } })
  }

  return { onDelete, isPending }
}
