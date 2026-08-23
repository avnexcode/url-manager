import { FormSkeleton, InputImageSkeleton } from '@/components/forms'
import {
  InputTextAreaSkeleton,
  InputTextSkeleton,
} from '@/components/forms/input-skeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import * as m from '@/generated/paraglide/messages'
import { Link } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import { FormProvider } from 'react-hook-form'
import type { UpdateUrlFormSchema } from '../types'
import { EditUrlFormInner } from './edit-url-form-inner'

type EditUrlFormProps = {
  form: UseFormReturn<UpdateUrlFormSchema>
  onSubmit: (values: UpdateUrlFormSchema) => void
  hasChanges: boolean
  isPending: boolean
  thumbnail?: string | null
  urlId: string
}

export const EditUrlForm = ({
  form,
  onSubmit,
  hasChanges,
  isPending,
  thumbnail,
  urlId,
}: EditUrlFormProps) => {
  return (
    <Card className="w-full">
      <CardContent>
        <FormProvider {...form}>
          <EditUrlFormInner
            formId="update-url-form"
            onSubmit={onSubmit}
            thumbnail={thumbnail}
          />
        </FormProvider>
      </CardContent>
      <CardFooter className="flex-col-reverse place-content-end gap-4 pt-5 xl:flex-row">
        <Button variant={'neutral'} className="w-full px-20 xl:w-fit" asChild>
          <Link
            preload={false}
            to={'/{-$locale}/dashboard/url/$id/view'}
            params={{ id: urlId }}
          >
            {m.page_shared_form_footer_cancel_button()}
          </Link>
        </Button>
        <Button
          type="submit"
          form="update-url-form"
          className="w-full px-20 xl:w-fit"
          disabled={isPending || !hasChanges}
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin" />
              {m.page_shared_form_footer_update_button_loading()} . . .
            </>
          ) : (
            m.page_shared_form_footer_update_button()
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

export const EditUrlFormSkeleton = () => {
  return (
    <FormSkeleton>
      <InputTextSkeleton />
      <InputTextAreaSkeleton />
      <InputTextSkeleton />
      <InputImageSkeleton />
      <InputTextSkeleton />
      <InputTextSkeleton />
    </FormSkeleton>
  )
}
