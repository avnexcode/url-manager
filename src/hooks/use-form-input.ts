import {
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
    InputText: BaseInputText<T>,
    InputTextArea: BaseInputTextArea<T>,
    InputPassword: BaseInputPassword<T>,
    InputImage: BaseInputImage<T>,
    InputFile: BaseInputFile<T>,
  }
}
