import * as m from '@/generated/paraglide/messages'
import { useToastMessages } from '@/hooks'
import type { UseMutationOptions } from '@/interfaces'
import { useTRPC } from '@/lib/trpc/react'
import type { PlatformResponse } from '@/server/features/platform'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import type { UpdatePlatformFormSchema } from '../types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { updatePlatformFormSchema } from '../schemas'
import { useMutation } from '@tanstack/react-query'
import { SUPABASE_BUCKET } from '@/lib/supabase/bucket'
import { deleteImageByUrl, uploadImage } from '@/lib/supabase/image-upload'
import { toast } from 'sonner'

const toFormValues = (platform: PlatformResponse): UpdatePlatformFormSchema => {
  return {
    title: platform.title,
    url: platform.url,
    visibility: platform.visibility,
    password: platform.password,
  }
}

export const useUpdatePlatform = (
  platform: PlatformResponse,
  { redirect = true, redirectTo, onSuccess, onError }: UseMutationOptions = {},
) => {
  const toastMessages = useToastMessages(m.model_platform_title())
  const trpc = useTRPC()
  const navigate = useNavigate()
  const [isUploading, setIsUploading] = useState(false)

  const initialValues = useMemo(() => toFormValues(platform), [platform])

  const form = useForm<UpdatePlatformFormSchema>({
    defaultValues: initialValues,
    resolver: zodResolver(updatePlatformFormSchema),
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
      onSuccess: () => {
        if (redirect) {
          void navigate({ to: redirectTo || '/{-$locale}/dashboard/platform' })
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
    let thumbnailUrl = platform.thumbnail
    let newThumbnail = false

    try {
      if (values.thumbnail) {
        setIsUploading(true)

        const fileName = `${values.title.toLocaleLowerCase()}.png`

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
      await mutateAsync({
        id: platform.id,
        request: { ...values, thumbnail: thumbnailUrl },
      })
    } catch {
      if (thumbnailUrl && newThumbnail) {
        await deleteImageByUrl(SUPABASE_BUCKET.Profile, thumbnailUrl)
      }
    }
  }

  return { form, onSubmit, hasChanges, isPending: isPending || isUploading }
}
