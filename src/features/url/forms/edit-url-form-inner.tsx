import * as m from '@/generated/paraglide/messages'
import { useFormInput } from '@/hooks'
import { useFormContext } from 'react-hook-form'
import type { UpdateUrlFormSchema } from '../types'

type EditUrlFormInnerProps = {
  formId: string
  onSubmit: (values: UpdateUrlFormSchema) => void
  thumbnail?: string | null
}

export const EditUrlFormInner = ({
  formId,
  onSubmit,
  thumbnail,
}: EditUrlFormInnerProps) => {
  const form = useFormContext<UpdateUrlFormSchema>()

  const { InputText, InputTextArea, InputImage } =
    useFormInput<UpdateUrlFormSchema>()

  return (
    <form
      id={formId}
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <InputText name="title" label={m.model_url_field_title()} required />
      <InputTextArea
        name="description"
        label={m.model_url_field_description()}
      />
      <InputText name="url" label={m.model_url_field_url()} required />
      <InputImage
        name="thumbnail"
        label={m.model_url_field_thumbnail()}
        className="w-full"
        image={thumbnail}
      />
    </form>
  )
}
