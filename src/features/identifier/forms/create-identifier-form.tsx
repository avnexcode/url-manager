import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import * as m from '@/generated/paraglide/messages'
import { Link } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import { FormProvider } from 'react-hook-form'
import type { CreateIdentifierFormSchema } from '../types'
import { CreateIdentifierFormInner } from './create-identifier-form-inner'

type CreateIdentifierFormProps = {
  form: UseFormReturn<CreateIdentifierFormSchema>
  onSubmit: (values: CreateIdentifierFormSchema) => void
  isPending: boolean
}

export const CreateIdentifierForm = ({
  form,
  onSubmit,
  isPending,
}: CreateIdentifierFormProps) => {
  return (
    <Card className="w-full border-0 shadow-0 md:border-2 md:shadow-shadow">
      <CardContent>
        <FormProvider {...form}>
          <CreateIdentifierFormInner
            formId="create-identifier-form"
            onSubmit={onSubmit}
          />
        </FormProvider>
      </CardContent>
      <CardFooter className="flex-col-reverse place-content-end gap-4 pt-5 xl:flex-row">
        <Button variant={'neutral'} className="w-full px-20 xl:w-fit" asChild>
          <Link preload={false} to={'/{-$locale}/dashboard/identifier'}>
            {m.page_shared_form_footer_cancel_button()}
          </Link>
        </Button>
        <Button
          type="submit"
          form="create-identifier-form"
          className="w-full px-20 xl:w-fit"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin" />
              {m.page_shared_form_footer_create_button_loading()} . . .
            </>
          ) : (
            m.page_shared_form_footer_create_button()
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
