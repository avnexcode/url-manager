import { InputSelect } from '@/components/forms'
import * as m from '@/generated/paraglide/messages'
import { useFormInput } from '@/hooks'
import { getVisibilityOptions } from '@/lib/get-form-options'
import { useFormContext } from 'react-hook-form'
import type { UpdateIdentifierFormSchema } from '../types'

type EditIdentifierFormInnerProps = {
  formId: string
  onSubmit: (values: UpdateIdentifierFormSchema) => void
  thumbnail?: string | null
}

export const EditIdentifierFormInner = ({
  formId,
  onSubmit,
  thumbnail,
}: EditIdentifierFormInnerProps) => {
  const form = useFormContext<UpdateIdentifierFormSchema>()

  const { InputText, InputPassword, InputImage } =
    useFormInput<UpdateIdentifierFormSchema>()

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
      <InputSelect<UpdateIdentifierFormSchema, 'visibility'>
        name="visibility"
        label={m.model_identifier_field_visibility()}
        required
        options={getVisibilityOptions()}
      />
      <InputImage
        name="thumbnail"
        label={m.model_identifier_field_thumbnail()}
        className="w-full"
        image={thumbnail}
      />
      <InputPassword
        name="password"
        label={m.model_identifier_field_password()}
        autoComplete="off"
      />
    </form>
  )
}
