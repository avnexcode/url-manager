import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import * as m from '@/generated/paraglide/messages'
import { useFormInput } from '@/hooks'
import { useFormContext } from 'react-hook-form'
import type { UpdateAccountFormSchema } from '../types'

type EditAccountFormInnerProps = {
  formId: string
  onSubmit: (values: UpdateAccountFormSchema) => void
  email: string
  image?: string | null
  avatar?: string | null
}

export const EditAccountFormInner = ({
  formId,
  onSubmit,
  email,
  image,
  avatar,
}: EditAccountFormInnerProps) => {
  const form = useFormContext<UpdateAccountFormSchema>()
  const { InputText, InputAvatar } = useFormInput<UpdateAccountFormSchema>()

  return (
    <form
      id={formId}
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <div className="flex w-full flex-col items-center justify-between gap-10 xl:flex-row">
        <div className="aspect-square w-50 rounded-full">
          <InputAvatar
            name="image"
            label={m.model_user_field_image()}
            className="w-full"
            image={image ?? avatar}
          />
        </div>
        <div className="w-full flex-1 space-y-5">
          <div className="space-y-3 pb-5">
            <Label>
              {m.model_user_field_email()}
              <span className="ml-1.5 text-destructive">*</span>
            </Label>
            <Input
              className="disabled"
              placeholder={m.form_placeholder_input({
                field: m.model_user_field_email(),
              })}
              value={email}
              readOnly
              disabled
            />
          </div>
          <InputText
            name="username"
            label={m.model_user_field_username()}
            required
          />
        </div>
      </div>
    </form>
  )
}
