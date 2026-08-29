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
import type { DeleteAccountFormSchema } from '../types'
import { DeleteAccountFormInner } from './delete-account-form-inner'
import { Heading } from '@/components'

type DeleteAccountFormProps = {
  form: UseFormReturn<DeleteAccountFormSchema>
  onSubmit: (values: DeleteAccountFormSchema) => void
  isPending: boolean
}

export const DeleteAccountForm = ({
  form,
  onSubmit,
  isPending,
}: DeleteAccountFormProps) => {
  return (
    <Card className="w-full border-0 shadow-0 md:border-2 md:shadow-shadow">
      <CardHeader>
        <CardTitle>
          <Heading size={'h3'}>
            {m.page_auth_form_delete_account_header_title()}
          </Heading>
        </CardTitle>
        <CardDescription>
          {m.page_auth_form_delete_account_header_description()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <DeleteAccountFormInner
            formId="delete-account-form"
            onSubmit={onSubmit}
          />
        </FormProvider>
      </CardContent>
      <CardFooter className="flex-col-reverse place-content-end gap-4 pt-5 xl:flex-row">
        <Button
          variant={'destructive'}
          type="submit"
          form="delete-account-form"
          className="w-full px-20 xl:w-fit"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin" />
              {m.page_shared_form_footer_delete_button_loading()} . . .
            </>
          ) : (
            m.page_shared_form_footer_delete_button()
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
