import { SelectIdentifierForm } from '@/features/identifier/forms'
import { useSelectIdentifier } from '@/features/identifier/hooks'
import { SelectPlatformForm } from '@/features/platform/forms'
import { useSelectPlatform } from '@/features/platform/hooks'
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

  const selectIdentifierHook =
    useSelectIdentifier<CreateUrlFormSchema>('identifierId')

  const selectPlatformHook =
    useSelectPlatform<CreateUrlFormSchema>('platformId')

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
      <SelectIdentifierForm<CreateUrlFormSchema>
        name="identifierId"
        label={m.model_identifier_title()}
        hookProps={selectIdentifierHook}
      />
      <SelectPlatformForm<CreateUrlFormSchema>
        name="platformId"
        label={m.model_platform_title()}
        hookProps={selectPlatformHook}
      />
    </form>
  )
}
