import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import * as m from '@/generated/paraglide/messages'
import { Link } from '@tanstack/react-router'
import type { LinkProps } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import { FormProvider } from 'react-hook-form'
import type { CreateUrlFormSchema } from '../types'
import { CreateUrlFormInner } from './create-url-form-inner'

type CreateUrlFormProps = {
  form: UseFormReturn<CreateUrlFormSchema>
  onSubmit: (values: CreateUrlFormSchema) => void
  isPending: boolean
  cancelTo: LinkProps['to']
}

export const CreateUrlForm = ({
  form,
  onSubmit,
  isPending,
  cancelTo,
}: CreateUrlFormProps) => {
  return (
    <Card className="w-full">
      <CardContent>
        <FormProvider {...form}>
          <CreateUrlFormInner formId="create-url-form" onSubmit={onSubmit} />
        </FormProvider>
      </CardContent>
      <CardFooter className="flex-col-reverse place-content-end gap-4 pt-5 xl:flex-row">
        <Button variant={'neutral'} className="w-full px-20 xl:w-fit" asChild>
          <Link preload={false} to={cancelTo}>
            {m.page_shared_form_footer_cancel_button()}
          </Link>
        </Button>
        <Button
          type="submit"
          form="create-url-form"
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
