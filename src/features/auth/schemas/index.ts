import * as m from '@/generated/paraglide/messages'
import { capitalizeSentence } from '@/utils'
import z from 'zod'
import { emailValidation } from './email-schema'
import { passwordValidation } from './password-schema'

export const registerFormSchema = () => {
  return z
    .object({
      email: emailValidation(),
      password: passwordValidation(),
      confirmPassword: z
        .string()
        .min(
          1,
          capitalizeSentence(
            m.schema_validation_password_confirm_password_required(),
          ),
        ),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: capitalizeSentence(
        m.schema_validation_password_confirm_password_do_not_match(),
      ),
      path: ['confirmPassword'],
    })
}

export const loginFormSchema = () => {
  const passwordField = m.model_auth_field_password()
  return z.object({
    email: emailValidation(),
    password: z.string().min(
      1,
      capitalizeSentence(
        m.schema_validation_common_required({
          field: passwordField,
        }),
      ),
    ),
  })
}
