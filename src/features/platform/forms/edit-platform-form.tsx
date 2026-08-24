import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import * as m from '@/generated/paraglide/messages'
import { Link } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import { FormProvider } from 'react-hook-form'
import type { UpdatePlatformFormSchema } from '../types'
import { EditPlatformFormInner } from './edit-platform-form-inner'

type EditPlatformFormProps = {
  form: UseFormReturn<UpdatePlatformFormSchema>
  onSubmit: (values: UpdatePlatformFormSchema) => void
  hasChanges: boolean
  isPending: boolean
  thumbnail?: string | null
  platformId: string
}

export const EditPlatformForm = ({
  form,
  onSubmit,
  hasChanges,
  isPending,
  thumbnail,
  platformId,
}: EditPlatformFormProps) => {
  return (
    <Card className="w-full">
      <CardContent>
        <FormProvider {...form}>
          <EditPlatformFormInner
            formId="update-platform-form"
            onSubmit={onSubmit}
            thumbnail={thumbnail}
          />
        </FormProvider>
      </CardContent>
      <CardFooter className="flex-col-reverse place-content-end gap-4 pt-5 xl:flex-row">
        <Button variant={'neutral'} className="w-full px-20 xl:w-fit" asChild>
          <Link
            preload={false}
            to={'/{-$locale}/dashboard/platform/$id/view'}
            params={{ id: platformId }}
          >
            {m.page_shared_form_footer_cancel_button()}
          </Link>
        </Button>
        <Button
          type="submit"
          form="update-platform-form"
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
