import { InputSelect } from '@/components/forms'
import * as m from '@/generated/paraglide/messages'
import { useFormInput } from '@/hooks'
import { getVisibilityOptions } from '@/lib/get-form-options'
import { useFormContext } from 'react-hook-form'
import type { CreateIdentifierFormSchema } from '../types'

type CreateIdentifierFormInnerProps = {
  formId: string
  onSubmit: (values: CreateIdentifierFormSchema) => void
}

export const CreateIdentifierFormInner = ({
  formId,
  onSubmit,
}: CreateIdentifierFormInnerProps) => {
  const form = useFormContext<CreateIdentifierFormSchema>()

  const { InputText, InputTextArea, InputPassword, InputImage } =
    useFormInput<CreateIdentifierFormSchema>()

  return (
    <form
      id={formId}
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <InputText
        name="title"
        label={m.model_identifier_field_title()}
        required
      />
      <InputTextArea
        name="description"
        label={m.model_identifier_field_description()}
      />
      <InputSelect<CreateIdentifierFormSchema, 'visibility'>
        name="visibility"
        label={m.model_identifier_field_visibility()}
        required
        options={getVisibilityOptions()}
      />
      <InputImage
        name="thumbnail"
        label={m.model_identifier_field_thumbnail()}
        className="w-full"
      />
      <InputPassword
        name="password"
        label={m.model_identifier_field_password()}
        autoComplete="off"
      />
    </form>
  )
}
