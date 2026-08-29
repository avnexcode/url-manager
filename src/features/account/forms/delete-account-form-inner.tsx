import * as m from '@/generated/paraglide/messages'
import { useFormInput } from '@/hooks'
import { useFormContext } from 'react-hook-form'
import type { DeleteAccountFormSchema } from '../types'

type DeleteAccountFormInnerProps = {
  formId: string
  onSubmit: (values: DeleteAccountFormSchema) => void
}

export const DeleteAccountFormInner = ({
  formId,
  onSubmit,
}: DeleteAccountFormInnerProps) => {
  const form = useFormContext<DeleteAccountFormSchema>()
  const { InputPassword } = useFormInput<DeleteAccountFormSchema>()

  return (
    <form
      id={formId}
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <InputPassword
        name="password"
        label={m.model_auth_field_password()}
        required
        autoComplete="off"
      />
    </form>
  )
}
