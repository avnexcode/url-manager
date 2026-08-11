import * as m from '@/generated/paraglide/messages'
import { useFormInput } from '@/hooks'
import { useFormContext } from 'react-hook-form'
import type { RegisterFormSchema } from '../types'

type RegisterFormInnerProps = {
  formId: string
  onSubmit: (values: RegisterFormSchema) => void
}

export const RegisterFormInner = ({
  formId,
  onSubmit,
}: RegisterFormInnerProps) => {
  const form = useFormContext<RegisterFormSchema>()
  const { InputText, InputPassword } = useFormInput<RegisterFormSchema>()

  return (
    <form
      id={formId}
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <InputText
        name="email"
        type="email"
        label={m.model_auth_field_email()}
        required
      />
      <InputText
        name="username"
        type="username"
        label={m.model_auth_field_username()}
        required
      />
      <InputPassword
        name="password"
        label={m.model_auth_field_password()}
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
