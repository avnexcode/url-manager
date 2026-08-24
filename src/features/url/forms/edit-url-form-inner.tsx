import { SelectIdentifierForm } from '@/features/identifier/forms'
import { useSelectIdentifier } from '@/features/identifier/hooks'
import { SelectPlatformForm } from '@/features/platform/forms'
import { useSelectPlatform } from '@/features/platform/hooks'
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

  const selectIdentifierHook =
    useSelectIdentifier<UpdateUrlFormSchema>('identifierId')

  const selectPlatformHook =
    useSelectPlatform<UpdateUrlFormSchema>('platformId')

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
      <SelectIdentifierForm<UpdateUrlFormSchema>
        name="identifierId"
        label={m.model_identifier_title()}
        hookProps={selectIdentifierHook}
      />
      <SelectPlatformForm<UpdateUrlFormSchema>
        name="platformId"
        label={m.model_platform_title()}
        hookProps={selectPlatformHook}
      />
    </form>
  )
}
