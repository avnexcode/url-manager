import * as m from '@/generated/paraglide/messages'
import { useAuth, useToastMessages } from '@/hooks'
import type { UseMutationOptions } from '@/interfaces'
import { SUPABASE_BUCKET } from '@/lib/supabase/bucket'
import { deleteImageByUrl, uploadImage } from '@/lib/supabase/image-upload'
import { useTRPC } from '@/lib/trpc/react'
import { generateSlug } from '@/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { createPlatformFormSchema } from '../schemas'
import type { CreatePlatformFormSchema } from '../types'

export const useCreatePlatform = ({
  redirect = true,
  redirectTo,
  onSuccess,
  onError,
}: UseMutationOptions = {}) => {
  const { user } = useAuth()
  const toastMessages = useToastMessages(m.model_platform_title())
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [isUploading, setIsUploading] = useState(false)

  const form = useForm<CreatePlatformFormSchema>({
    defaultValues: {
      title: '',
      url: '',
      password: '',
      thumbnail: null,
      visibility: 'PRIVATE',
    },
    resolver: zodResolver(createPlatformFormSchema),
  })

  const { mutateAsync, isPending } = useMutation(
    trpc.platform.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.platform.getAll.queryKey(),
        })
        if (redirect) {
          void navigate({ to: redirectTo || '/{-$locale}/dashboard/platform' })
        }
        toastMessages.onCreate.onSuccess()
        onSuccess?.()
      },
      onError: (error) => {
        toastMessages.onCreate.onError(error)
        onError?.()
      },
    }),
  )

  const onSubmit = async (values: CreatePlatformFormSchema) => {
    let thumbnailUrl = null

    try {
      if (values.thumbnail) {
        setIsUploading(true)

        const fileName = `${user.username}-th-${generateSlug({ text: values.title })}.png`

        thumbnailUrl = await uploadImage(
          SUPABASE_BUCKET.Platform,
          fileName,
          values.thumbnail,
        )

        setIsUploading(false)
      }
    } catch (error) {
      toast.error(
        m.error_message_upload({ field: m.model_platform_field_thumbnail() }),
      )
    } finally {
      setIsUploading(false)
    }

    try {
      await mutateAsync({ request: { ...values, thumbnail: thumbnailUrl } })
    } catch {
      if (thumbnailUrl) {
        await deleteImageByUrl(SUPABASE_BUCKET.Profile, thumbnailUrl)
      }
    }
  }

  return { form, onSubmit, isPending: isPending || isUploading }
}
