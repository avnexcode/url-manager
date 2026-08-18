import { InputSelect } from '@/components/forms'
import * as m from '@/generated/paraglide/messages'
import { useFormInput } from '@/hooks'
import { getVisibilityOptions } from '@/lib/get-form-options'
import { useFormContext } from 'react-hook-form'
import type { CreatePlatformFormSchema } from '../types'

type CreatePlatformFormInnerProps = {
  formId: string
  onSubmit: (values: CreatePlatformFormSchema) => void
}

export const CreatePlatformFormInner = ({
  formId,
  onSubmit,
}: CreatePlatformFormInnerProps) => {
  const form = useFormContext<CreatePlatformFormSchema>()

  const { InputText, InputPassword, InputImage } =
    useFormInput<CreatePlatformFormSchema>()

  return (
    <form
      id={formId}
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <InputText name="title" label={m.model_platform_field_title()} required />
      <InputText name="url" label={m.model_platform_field_url()} required />
      <InputSelect<CreatePlatformFormSchema, 'visibility'>
        name="visibility"
        label={m.model_platform_field_visibility()}
        required
        options={getVisibilityOptions()}
      />
      <InputImage
        name="thumbnail"
        label={m.model_platform_field_thumbnail()}
        className="w-full"
      />
      <InputPassword
        name="password"
        label={m.model_platform_field_password()}
        autoComplete="off"
      />
    </form>
  )
}
