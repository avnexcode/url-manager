import type { UserResponse } from '@/features/account/types'
import * as m from '@/generated/paraglide/messages'
import { useToastMessages } from '@/hooks'
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
import { updateAccountFormSchema } from '../schemas'
import type { UpdateAccountFormSchema } from '../types'

const toFormValues = (account: UserResponse): UpdateAccountFormSchema => {
  return {
    username: account.username,
  }
}

export const useUpdateAccount = (
  account: UserResponse,
  { redirect = true, redirectTo, onSuccess, onError }: UseMutationOptions = {},
) => {
  const toastMessages = useToastMessages(m.model_user_title())
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [isUploading, setIsUploading] = useState(false)

  const initialValues = useMemo(() => toFormValues(account), [account])

  const form = useForm<UpdateAccountFormSchema>({
    defaultValues: initialValues,
    resolver: zodResolver(updateAccountFormSchema),
  })

  useEffect(() => {
    form.reset(initialValues)
  }, [initialValues, form])

  const watchedValues = form.watch()

  const hasChanges = useMemo(() => {
    const hasFieldChanges =
      JSON.stringify(watchedValues) !== JSON.stringify(initialValues)
    const hasNewImageFile = watchedValues.image instanceof File

    return hasFieldChanges || hasNewImageFile
  }, [watchedValues, initialValues])

  const { mutateAsync, isPending } = useMutation(
    trpc.auth.updateAccount.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.auth.getAccount.queryKey(),
        })
        if (redirect) {
          void navigate({ to: redirectTo || '/{-$locale}/account' })
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

  const onSubmit = async (values: UpdateAccountFormSchema) => {
    let imageUrl = account.image
    let image = false

    try {
      if (values.image) {
        setIsUploading(true)

        const fileName = `${generateSlug({ text: values.username })}.png`

        imageUrl = await uploadImage(
          SUPABASE_BUCKET.Profile,
          fileName,
          values.image,
        )
        image = true

        setIsUploading(false)
      }
    } catch (error) {
      toast.error(m.error_message_upload({ field: m.model_user_field_image() }))
    } finally {
      setIsUploading(false)
    }

    try {
      await mutateAsync({ request: { ...values, image: imageUrl } })
    } catch {
      if (imageUrl && image) {
        await deleteImageByUrl(SUPABASE_BUCKET.Profile, imageUrl)
      }
    }
  }

  return { form, onSubmit, hasChanges, isPending: isPending || isUploading }
}
