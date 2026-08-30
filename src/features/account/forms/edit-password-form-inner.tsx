import * as m from '@/generated/paraglide/messages'
import { useFormInput } from '@/hooks'
import { useFormContext } from 'react-hook-form'
import type { UpdatePasswordFormSchema } from '../types'
import type { LoginProvider } from '@/generated/prisma/enums'

type EditPasswordFormInnerProps = {
  formId: string
  onSubmit: (values: UpdatePasswordFormSchema) => void
  providers: LoginProvider[]
}

export const EditPasswordFormInner = ({
  formId,
  onSubmit,
  providers,
}: EditPasswordFormInnerProps) => {
  const form = useFormContext<UpdatePasswordFormSchema>()
  const { InputPassword } = useFormInput<UpdatePasswordFormSchema>()

  return (
    <form
      id={formId}
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-5"
    >
      {providers.includes('CREDENTIALS') && (
        <InputPassword
          name="currentPassword"
          label={m.model_auth_field_current_password()}
          required
          autoComplete="off"
        />
      )}
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
