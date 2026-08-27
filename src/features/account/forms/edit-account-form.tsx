import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import * as m from '@/generated/paraglide/messages'
import { Loader2 } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import { FormProvider } from 'react-hook-form'
import type { UpdateAccountFormSchema } from '../types'
import { EditAccountFormInner } from './edit-account-form-inner'

type EditAccountFormProps = {
  form: UseFormReturn<UpdateAccountFormSchema>
  onSubmit: (values: UpdateAccountFormSchema) => void
  hasChanges: boolean
  isPending: boolean
  email: string
  image?: string | null
}

export const EditAccountForm = ({
  form,
  onSubmit,
  hasChanges,
  isPending,
  email,
  image,
}: EditAccountFormProps) => {
  return (
    <Card className="w-full border-0 shadow-0 md:border-2 md:shadow-shadow">
      <CardContent>
        <FormProvider {...form}>
          <EditAccountFormInner
            formId="update-account-form"
            onSubmit={onSubmit}
            email={email}
            image={image}
          />
        </FormProvider>
      </CardContent>
      <CardFooter className="flex-col-reverse place-content-end gap-4 pt-5 xl:flex-row">
        <Button
          type="submit"
          form="update-account-form"
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
