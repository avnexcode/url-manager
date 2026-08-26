import * as m from '@/generated/paraglide/messages'
import { useFormInput } from '@/hooks'
import type { PublicAccessPasswordFormSchema } from '@/types'
import { useFormContext } from 'react-hook-form'

type PublicAccessPasswordFormInnerProps = {
  formId: string
  onSubmit: (values: PublicAccessPasswordFormSchema) => void
}

export const PublicAccessPasswordFormInner = ({
  formId,
  onSubmit,
}: PublicAccessPasswordFormInnerProps) => {
  const form = useFormContext<PublicAccessPasswordFormSchema>()

  const { InputPassword } = useFormInput<PublicAccessPasswordFormSchema>()

  return (
    <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
      <InputPassword
        name="password"
        label={m.model_platform_field_password()}
        autoComplete="off"
      />
    </form>
  )
}
