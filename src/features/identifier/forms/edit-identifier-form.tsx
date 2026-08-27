import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import * as m from '@/generated/paraglide/messages'
import { Link } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import { FormProvider } from 'react-hook-form'
import type { UpdateIdentifierFormSchema } from '../types'
import { EditIdentifierFormInner } from './edit-identifier-form-inner'

type EditIdentifierFormProps = {
  form: UseFormReturn<UpdateIdentifierFormSchema>
  onSubmit: (values: UpdateIdentifierFormSchema) => void
  hasChanges: boolean
  isPending: boolean
  thumbnail?: string | null
  identifierId: string
}

export const EditIdentifierForm = ({
  form,
  onSubmit,
  hasChanges,
  isPending,
  thumbnail,
  identifierId,
}: EditIdentifierFormProps) => {
  return (
    <Card className="w-full border-0 shadow-0 md:border-2 md:shadow-shadow">
      <CardContent>
        <FormProvider {...form}>
          <EditIdentifierFormInner
            formId="update-identifier-form"
            onSubmit={onSubmit}
            thumbnail={thumbnail}
          />
        </FormProvider>
      </CardContent>
      <CardFooter className="flex-col-reverse place-content-end gap-4 pt-5 xl:flex-row">
        <Button variant={'neutral'} className="w-full px-20 xl:w-fit" asChild>
          <Link
            preload={false}
            to={'/{-$locale}/dashboard/identifier/$id/view'}
            params={{ id: identifierId }}
          >
            {m.page_shared_form_footer_cancel_button()}
          </Link>
        </Button>
        <Button
          type="submit"
          form="update-identifier-form"
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
