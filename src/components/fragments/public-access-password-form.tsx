import { Card, CardContent, CardFooter } from '@/components/ui/card'
import * as m from '@/generated/paraglide/messages'
import type { PublicAccessPasswordFormSchema } from '@/types'
import type { LinkProps } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import { FormProvider } from 'react-hook-form'
import { Button } from '../ui/button'
import { PublicAccessPasswordFormInner } from './public-access-password-form-inner'

type PublicAccessPasswordFormProps = {
  form: UseFormReturn<PublicAccessPasswordFormSchema>
  onSubmit: (values: PublicAccessPasswordFormSchema) => void
  isPending: boolean
  cancelTo: LinkProps['to']
}

export const PublicAccessPasswordForm = ({
  form,
  onSubmit,
  isPending,
  cancelTo,
}: PublicAccessPasswordFormProps) => {
  return (
    <Card className="w-full">
      <CardContent>
        <FormProvider {...form}>
          <fieldset disabled={isPending} className="space-y-4">
            <PublicAccessPasswordFormInner
              formId="public-access-password-form"
              onSubmit={onSubmit}
            />
          </fieldset>
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
          form="public-access-password-form"
          className="w-full px-20 xl:w-fit"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin" />
              {m.page_shared_form_footer_submit_button_loading()} . . .
            </>
          ) : (
            m.page_shared_form_footer_submit_button()
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
