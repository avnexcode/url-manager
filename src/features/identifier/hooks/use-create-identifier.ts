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
import { createIdentifierFormSchema } from '../schemas'
import type { CreateIdentifierFormSchema } from '../types'

export const useCreateIdentifier = ({
  redirect = true,
  redirectTo,
  onSuccess,
  onError,
}: UseMutationOptions = {}) => {
  const { user } = useAuth()
  const toastMessages = useToastMessages(m.model_identifier_title())
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [isUploading, setIsUploading] = useState(false)

  const form = useForm<CreateIdentifierFormSchema>({
    defaultValues: {
      title: '',
      description: '',
      password: '',
      thumbnail: null,
      visibility: 'PRIVATE',
    },
    resolver: zodResolver(createIdentifierFormSchema),
  })

  const { mutateAsync, isPending } = useMutation(
    trpc.identifier.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.identifier.getAll.queryKey(),
        })
        if (redirect) {
          void navigate({
            to: redirectTo || '/{-$locale}/dashboard/identifier',
          })
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

  const onSubmit = async (values: CreateIdentifierFormSchema) => {
    let thumbnailUrl = null

    try {
      if (values.thumbnail) {
        setIsUploading(true)

        const fileName = `${user.username}-th-${generateSlug({ text: values.title })}.png`

        thumbnailUrl = await uploadImage(
          SUPABASE_BUCKET.Identifier,
          fileName,
          values.thumbnail,
        )

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
      await mutateAsync({ request: { ...values, thumbnail: thumbnailUrl } })
    } catch {
      if (thumbnailUrl) {
        await deleteImageByUrl(SUPABASE_BUCKET.Identifier, thumbnailUrl)
      }
    }
  }

  return { form, onSubmit, isPending: isPending || isUploading }
}
