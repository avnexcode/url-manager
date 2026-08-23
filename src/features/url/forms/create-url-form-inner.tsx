import * as m from '@/generated/paraglide/messages'
import { useFormInput } from '@/hooks'
import { useFormContext } from 'react-hook-form'
import type { CreateUrlFormSchema } from '../types'

type CreateUrlFormInnerProps = {
  formId: string
  onSubmit: (values: CreateUrlFormSchema) => void
}

export const CreateUrlFormInner = ({
  formId,
  onSubmit,
}: CreateUrlFormInnerProps) => {
  const form = useFormContext<CreateUrlFormSchema>()

  const { InputText, InputTextArea, InputImage } =
    useFormInput<CreateUrlFormSchema>()

  return (
    <form
      id={formId}
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <InputText name="title" label={m.model_url_field_title()} required />
      <InputText name="url" label={m.model_url_field_url()} required />
      <InputTextArea
        name="description"
        label={m.model_url_field_description()}
      />

      <InputImage
        name="thumbnail"
        label={m.model_url_field_thumbnail()}
        className="w-full"
      />
    </form>
  )
}
