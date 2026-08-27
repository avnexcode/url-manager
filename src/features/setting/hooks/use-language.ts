import * as m from '@/generated/paraglide/messages'
import type { Language } from '@/generated/prisma/enums'
import { useToastMessages } from '@/hooks'
import type { UseMutationOptions } from '@/interfaces'
import { useTRPC } from '@/lib/trpc/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useLanguage = ({
  onSuccess,
  onError,
}: UseMutationOptions = {}) => {
  const toastMessages = useToastMessages(m.model_setting_field_language())
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

  const handleLanguageChange = (values: Language) => {
    mutate({ request: { language: values } })
  }

  return { handleLanguageChange, isPending }
}
