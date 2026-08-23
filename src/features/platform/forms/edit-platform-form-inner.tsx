import { InputSelect } from '@/components/forms'
import * as m from '@/generated/paraglide/messages'
import { useFormInput } from '@/hooks'
import { getVisibilityOptions } from '@/lib/get-form-options'
import { useFormContext } from 'react-hook-form'
import type { UpdatePlatformFormSchema } from '../types'

type EditPlatformFormInnerProps = {
  formId: string
  onSubmit: (values: UpdatePlatformFormSchema) => void
  thumbnail?: string | null
}

export const EditPlatformFormInner = ({
  formId,
  onSubmit,
  thumbnail,
}: EditPlatformFormInnerProps) => {
  const form = useFormContext<UpdatePlatformFormSchema>()

  const { InputText, InputTextArea, InputPassword, InputImage } =
    useFormInput<UpdatePlatformFormSchema>()

  return (
    <form
      id={formId}
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <InputText name="title" label={m.model_platform_field_title()} required />
      <InputTextArea
        name="description"
        label={m.model_platform_field_description()}
      />
      <InputText name="url" label={m.model_platform_field_url()} required />
      <InputSelect<UpdatePlatformFormSchema, 'visibility'>
        name="visibility"
        label={m.model_platform_field_visibility()}
        required
        options={getVisibilityOptions()}
      />
      <InputImage
        name="thumbnail"
        label={m.model_platform_field_thumbnail()}
        className="w-full"
        image={thumbnail}
      />
      <InputPassword
        name="password"
        label={m.model_platform_field_password()}
        autoComplete="off"
      />
    </form>
  )
}
