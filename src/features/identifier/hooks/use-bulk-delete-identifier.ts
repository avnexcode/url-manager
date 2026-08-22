import * as m from '@/generated/paraglide/messages'
import { useToastMessages } from '@/hooks'
import type { UseMutationOptions } from '@/interfaces'
import { useTRPC } from '@/lib/trpc/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

export const useBulkDeleteIdentifiers = ({
  redirect = true,
  redirectTo,
  onSuccess,
  onError,
}: UseMutationOptions = {}) => {
  const toastMessages = useToastMessages(m.model_identifier_title())
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutate, isPending, variables } = useMutation(
    trpc.identifier.deleteMany.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.identifier.getAll.queryKey(),
        })
        if (redirect) {
          void navigate({
            to: redirectTo || '/{-$locale}/dashboard/identifier',
          })
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

  const onBulkDelete = (values: { ids: string[] }) => {
    mutate({ request: { ids: values.ids } })
  }

  return { onBulkDelete, isPending, variables }
}
