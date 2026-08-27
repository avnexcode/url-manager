import * as m from '@/generated/paraglide/messages'
import { useAuth, useToastMessages } from '@/hooks'
import type { UseMutationOptions } from '@/interfaces'
import { useTRPC } from '@/lib/trpc/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

type PublicAccessField =
  'publicAccess' | 'publicPlatformAccess' | 'publicIdentifierAccess'

export const usePublicAccess = ({
  onSuccess,
  onError,
}: UseMutationOptions = {}) => {
  const { setting } = useAuth()
  const toastMessages = useToastMessages(m.model_setting_title())
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation(
    trpc.setting.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.setting.getByUser.queryKey(),
        })
        toastMessages.onUpdate.onSuccess()
        onSuccess?.()
      },
      onError: (error) => {
        toastMessages.onUpdate.onError(error)
        onError?.()
      },
    }),
  )

  const handlePublicAccessChange = (
    field: PublicAccessField,
    checked: boolean,
  ) => {
    mutate({
      request: {
        publicAccess: setting.publicAccess,
        publicPlatformAccess: setting.publicPlatformAccess,
        publicIdentifierAccess: setting.publicIdentifierAccess,
        [field]: checked,
      },
    })
  }

  return { handlePublicAccessChange, isPending }
}
