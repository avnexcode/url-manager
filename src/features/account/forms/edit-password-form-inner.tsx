import * as m from '@/generated/paraglide/messages'
import { useFormInput } from '@/hooks'
import { useFormContext } from 'react-hook-form'
import type { UpdatePasswordFormSchema } from '../types'

type EditPasswordFormInnerProps = {
  formId: string
  onSubmit: (values: UpdatePasswordFormSchema) => void
}

export const EditPasswordFormInner = ({
  formId,
  onSubmit,
}: EditPasswordFormInnerProps) => {
  const form = useFormContext<UpdatePasswordFormSchema>()
  const { InputPassword } = useFormInput<UpdatePasswordFormSchema>()

  return (
    <form
      id={formId}
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <InputPassword
        name="currentPassword"
        label={m.model_auth_field_current_password()}
        required
        autoComplete="off"
      />
      <InputPassword
        name="password"
        label={m.model_auth_field_new_password()}
        required
        autoComplete="off"
      />
      <InputPassword
        name="confirmPassword"
        label={m.model_auth_field_confirm_password()}
        required
        autoComplete="off"
      />
    </form>
  )
}
