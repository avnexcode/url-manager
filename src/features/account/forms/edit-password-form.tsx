import { Heading } from '@/components'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import * as m from '@/generated/paraglide/messages'
import { Loader2 } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import { FormProvider } from 'react-hook-form'
import type { UpdatePasswordFormSchema } from '../types'
import { EditPasswordFormInner } from './edit-password-form-inner'

type EditPasswordFormProps = {
  form: UseFormReturn<UpdatePasswordFormSchema>
  onSubmit: (values: UpdatePasswordFormSchema) => void
  isPending: boolean
}

export const EditPasswordForm = ({
  form,
  onSubmit,
  isPending,
}: EditPasswordFormProps) => {
  return (
    <Card className="w-full border-0 shadow-0 md:border-2 md:shadow-shadow">
      <CardHeader>
        <CardTitle>
          <Heading size={'h3'}>
            {m.page_auth_form_update_password_header_title()}
          </Heading>
        </CardTitle>
        <CardDescription>
          {m.page_auth_form_update_password_header_description()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <EditPasswordFormInner
            formId="update-password-form"
            onSubmit={onSubmit}
          />
        </FormProvider>
      </CardContent>
      <CardFooter className="flex-col-reverse place-content-end gap-4 pt-5 xl:flex-row">
        <Button
          type="submit"
          form="update-password-form"
          className="w-full px-20 xl:w-fit"
          disabled={isPending}
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
