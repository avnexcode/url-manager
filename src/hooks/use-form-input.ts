import {
  InputAvatar as BaseInputAvatar,
  InputFile as BaseInputFile,
  InputImage as BaseInputImage,
  InputPassword as BaseInputPassword,
  InputText as BaseInputText,
  InputTextArea as BaseInputTextArea,
} from '@/components/forms'
import type { FieldValues } from 'react-hook-form'
import { useFormContext } from 'react-hook-form'

export const useFormInput = <T extends FieldValues>() => {
  useFormContext<T>()

  return {
    InputAvatar: BaseInputAvatar<T>,
    InputFile: BaseInputFile<T>,
    InputImage: BaseInputImage<T>,
    InputPassword: BaseInputPassword<T>,
    InputText: BaseInputText<T>,
    InputTextArea: BaseInputTextArea<T>,
  }
}
