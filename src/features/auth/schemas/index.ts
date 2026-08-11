import * as m from '@/generated/paraglide/messages'
import { capitalizeSentence } from '@/utils'
import z from 'zod'
import { emailValidation } from './email-schema'
import { passwordField, passwordValidation } from './password-schema'

export const registerFormSchema = z
  .object({
    username: z
      .string()
      .min(
        8,
        m.schema_validation_string_min({
          field: m.model_auth_field_username(),
          min: 8,
        }),
      )
      .max(
        100,
        m.schema_validation_string_max({
          field: m.model_auth_field_username(),
          max: 100,
        }),
      )
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        m.schema_validation_common_invalid({
          field: m.model_auth_field_username(),
        }),
      ),
    email: emailValidation,
    password: passwordValidation,
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

export const loginFormSchema = z.object({
  email: emailValidation,
  password: z.string().min(
    1,
    capitalizeSentence(
      m.schema_validation_common_required({
        field: passwordField,
      }),
    ),
  ),
})
