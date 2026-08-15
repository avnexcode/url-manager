import * as m from '@/generated/paraglide/messages'
import { useFormInput } from '@/hooks'
import { useFormContext } from 'react-hook-form'
import type { LoginFormSchema } from '../types'

type LoginFormInnerProps = {
  formId: string
  onSubmit: (values: LoginFormSchema) => void
}

export const LoginFormInner = ({ formId, onSubmit }: LoginFormInnerProps) => {
  const form = useFormContext<LoginFormSchema>()
  const { InputText, InputPassword } = useFormInput<LoginFormSchema>()

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
      <InputPassword
        name="password"
        label={m.model_auth_field_password()}
        autoComplete="off"
        required
      />
    </form>
  )
}
