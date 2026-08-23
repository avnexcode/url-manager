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
import { updateIdentifierFormSchema } from '../schemas'
import type { IdentifierResponse, UpdateIdentifierFormSchema } from '../types'

const toFormValues = (
  identifier: IdentifierResponse,
): UpdateIdentifierFormSchema => {
  return {
    title: identifier.title,
    description: identifier.description,
    visibility: identifier.visibility,
    password: identifier.password,
  }
}

export const useUpdateIdentifier = (
  identifier: IdentifierResponse,
  { redirect = true, redirectTo, onSuccess, onError }: UseMutationOptions = {},
) => {
  const { user } = useAuth()
  const toastMessages = useToastMessages(m.model_identifier_title())
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [isUploading, setIsUploading] = useState(false)

  const initialValues = useMemo(() => toFormValues(identifier), [identifier])

  const form = useForm<UpdateIdentifierFormSchema>({
    defaultValues: initialValues,
    resolver: zodResolver(updateIdentifierFormSchema),
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
    trpc.identifier.update.mutationOptions({
      onSuccess: async () => {
        await Promise.allSettled([
          queryClient.invalidateQueries({
            queryKey: trpc.identifier.getById.queryKey({ id: identifier.id }),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.identifier.getAll.queryKey(),
          }),
        ])
        if (redirect) {
          void navigate({
            to: redirectTo || '/{-$locale}/dashboard/identifier/$id/view',
            params: { id: identifier.id },
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

  const onSubmit = async (values: UpdateIdentifierFormSchema) => {
    let thumbnailUrl = identifier.thumbnail
    let newThumbnail = false

    try {
      if (values.thumbnail) {
        setIsUploading(true)

        const fileName = `${user.username}-th-${generateSlug({ text: values.title })}.png`

        thumbnailUrl = await uploadImage(
          SUPABASE_BUCKET.Identifier,
          fileName,
          values.thumbnail,
        )
        newThumbnail = true

        setIsUploading(false)
      }
    } catch (error) {
      toast.error(
        m.error_message_upload({ field: m.model_identifier_field_thumbnail() }),
      )
    } finally {
      setIsUploading(false)
    }

    try {
      await mutateAsync({
        id: identifier.id,
        request: { ...values, thumbnail: thumbnailUrl },
      })
    } catch {
      if (thumbnailUrl && newThumbnail) {
        await deleteImageByUrl(SUPABASE_BUCKET.Identifier, thumbnailUrl)
      }
    }
  }

  return { form, onSubmit, hasChanges, isPending: isPending || isUploading }
}
