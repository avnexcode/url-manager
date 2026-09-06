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
import { updateUrlFormSchema } from '../schemas'
import type { UpdateUrlFormSchema, UrlResponse } from '../types'

const toFormValues = (url?: UrlResponse): UpdateUrlFormSchema => {
  return {
    title: url?.title ?? '',
    description: url?.description,
    url: url?.url ?? '',
    identifierId: url?.identifierId,
    platformId: url?.platformId,
  }
}

export const useUpdateUrl = (
  id: string,
  url?: UrlResponse,
  { redirect = true, redirectTo, onSuccess, onError }: UseMutationOptions = {},
) => {
  const { user } = useAuth()
  const toastMessages = useToastMessages(m.model_url_title())
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [isUploading, setIsUploading] = useState(false)

  const initialValues = useMemo(() => toFormValues(url), [url])

  const form = useForm<UpdateUrlFormSchema>({
    defaultValues: initialValues,
    resolver: zodResolver(updateUrlFormSchema()),
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
    trpc.url.update.mutationOptions({
      onSuccess: async () => {
        await Promise.allSettled([
          queryClient.invalidateQueries({
            queryKey: trpc.url.getById.queryKey({ id }),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.url.getAll.queryKey(),
          }),
        ])
        if (redirect) {
          void navigate({
            to: redirectTo || '/{-$locale}/dashboard/url/$id/view',
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

  const onSubmit = async (values: UpdateUrlFormSchema) => {
    let thumbnailUrl = url?.thumbnail
    let newThumbnail = false

    try {
      if (values.thumbnail) {
        setIsUploading(true)

        const fileName = `${user?.username ?? 'user'}-th-${generateSlug({ text: values.title })}.png`

        thumbnailUrl = await uploadImage(
          SUPABASE_BUCKET.Url,
          fileName,
          values.thumbnail,
        )
        newThumbnail = true

        setIsUploading(false)
      }
    } catch (error) {
      toast.error(
        m.error_message_upload({ field: m.model_url_field_thumbnail() }),
      )
    } finally {
      setIsUploading(false)
    }

    try {
      await mutateAsync({ id, request: { ...values, thumbnail: thumbnailUrl } })
    } catch {
      if (thumbnailUrl && newThumbnail) {
        await deleteImageByUrl(SUPABASE_BUCKET.Url, thumbnailUrl)
      }
    }
  }

  return { form, onSubmit, hasChanges, isPending: isPending || isUploading }
}
