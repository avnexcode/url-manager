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
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { updatePlatformFormSchema } from '../schemas'
import type { PlatformResponse, UpdatePlatformFormSchema } from '../types'

const toFormValues = (
  platform?: PlatformResponse,
): UpdatePlatformFormSchema => {
  return {
    title: platform?.title ?? '',
    description: platform?.description,
    url: platform?.url ?? '',
    visibility: platform?.visibility ?? 'PRIVATE',
    password: platform?.password,
  }
}

export const useUpdatePlatform = (
  id: string,
  platform?: PlatformResponse,
  { redirect = true, redirectTo, onSuccess, onError }: UseMutationOptions = {},
) => {
  const { user } = useAuth()
  const toastMessages = useToastMessages(m.model_platform_title())
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [isUploading, setIsUploading] = useState(false)

  const initialValues = useMemo(() => toFormValues(platform), [platform])

  const form = useForm<UpdatePlatformFormSchema>({
    defaultValues: initialValues,
    resolver: zodResolver(updatePlatformFormSchema()),
  })

  useEffect(() => {
    form.reset(initialValues)
  }, [initialValues, form])

  const watchedValues = form.watch()

  const hasChanges = useMemo(() => {
    const hasFieldChanges =
      JSON.stringify(watchedValues) !== JSON.stringify(initialValues)
    const hasNewImageFile = watchedValues.thumbnail instanceof File

    return hasFieldChanges || hasNewImageFile
  }, [watchedValues, initialValues])

  const { mutateAsync, isPending } = useMutation(
    trpc.platform.update.mutationOptions({
      onSuccess: async () => {
        await Promise.allSettled([
          queryClient.invalidateQueries({
            queryKey: trpc.platform.getById.queryKey({ id }),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.platform.getAll.queryKey(),
          }),
        ])
        if (redirect) {
          void navigate({
            to: redirectTo || '/{-$locale}/dashboard/platform/$id/view',
            params: { id },
          })
        }
        toastMessages.onUpdate.onSuccess()
        onSuccess?.()
      },
      onError: (error) => {
        toastMessages.onUpdate.onError(error)
        onError?.()
      },
    }),
  )

  const onSubmit = async (values: UpdatePlatformFormSchema) => {
    let thumbnailUrl = platform?.thumbnail
    let newThumbnail = false

    try {
      if (values.thumbnail) {
        setIsUploading(true)

        const fileName = `${user?.username ?? 'user'}-th-${generateSlug({ text: values.title })}.png`

        thumbnailUrl = await uploadImage(
          SUPABASE_BUCKET.Platform,
          fileName,
          values.thumbnail,
        )
        newThumbnail = true

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
      await mutateAsync({ id, request: { ...values, thumbnail: thumbnailUrl } })
    } catch {
      if (thumbnailUrl && newThumbnail) {
        await deleteImageByUrl(SUPABASE_BUCKET.Platform, thumbnailUrl)
      }
    }
  }

  return { form, onSubmit, hasChanges, isPending: isPending || isUploading }
}
