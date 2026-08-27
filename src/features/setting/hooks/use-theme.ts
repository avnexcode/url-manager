import * as m from '@/generated/paraglide/messages'
import type { Theme } from '@/generated/prisma/enums'
import { useToastMessages } from '@/hooks'
import type { UseMutationOptions } from '@/interfaces'
import { useTRPC } from '@/lib/trpc/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useTheme = ({ onSuccess, onError }: UseMutationOptions = {}) => {
  const toastMessages = useToastMessages(m.model_setting_field_theme())
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

  const handleThemeChange = (values: Theme) => {
    mutate({ request: { theme: values } })
  }

  return { handleThemeChange, isPending }
}
