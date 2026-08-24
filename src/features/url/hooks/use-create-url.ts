import * as m from '@/generated/paraglide/messages'
import { useAuth, useToastMessages } from '@/hooks'
import type { UseMutationOptions } from '@/interfaces'
import { SUPABASE_BUCKET } from '@/lib/supabase/bucket'
import { deleteImageByUrl, uploadImage } from '@/lib/supabase/image-upload'
import { useTRPC } from '@/lib/trpc/react'
import type { CreateUrlSearchSchema } from '@/routes/{-$locale}/_authenticated/dashboard/url/create'
import { generateSlug } from '@/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { createUrlFormSchema } from '../schemas'
import type { CreateUrlFormSchema } from '../types'

export const useCreateUrl = (
  { redirect = true, redirectTo, onSuccess, onError }: UseMutationOptions = {},
  { from, id }: CreateUrlSearchSchema,
) => {
  const { user } = useAuth()
  const toastMessages = useToastMessages(m.model_url_title())
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [isUploading, setIsUploading] = useState(false)

  const form = useForm<CreateUrlFormSchema>({
    defaultValues: {
      title: '',
      url: '',
      description: '',
      thumbnail: null,
      identifierId: from === 'identifier' ? id : null,
      platformId: from === 'platform' ? id : null,
    },
    resolver: zodResolver(createUrlFormSchema),
  })

  const { mutateAsync, isPending } = useMutation(
    trpc.url.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.url.getAll.queryKey(),
        })
        if (redirect) {
          void navigate({ to: redirectTo || '/{-$locale}/dashboard/url' })
        }
        form.reset()
        toastMessages.onCreate.onSuccess()
        onSuccess?.()
      },
      onError: (error) => {
        toastMessages.onCreate.onError(error)
        onError?.()
      },
    }),
  )

  const onSubmit = async (values: CreateUrlFormSchema) => {
    let thumbnailUrl = null

    try {
      if (values.thumbnail) {
        setIsUploading(true)

        const fileName = `${user.username}-th-${generateSlug({ text: values.title })}.png`

        thumbnailUrl = await uploadImage(
          SUPABASE_BUCKET.Url,
          fileName,
          values.thumbnail,
        )

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
      await mutateAsync({ request: { ...values, thumbnail: thumbnailUrl } })
    } catch {
      if (thumbnailUrl) {
        await deleteImageByUrl(SUPABASE_BUCKET.Url, thumbnailUrl)
      }
    }
  }

  return { form, onSubmit, isPending: isPending || isUploading }
}
