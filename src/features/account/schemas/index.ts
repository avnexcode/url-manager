import { passwordValidation } from '@/features/auth/schemas/password-schema'
import * as m from '@/generated/paraglide/messages'
import type { LoginProvider } from '@/generated/prisma/enums'
import { capitalizeSentence } from '@/utils'
import z from 'zod'

export const usernameValidation = () => {
  return z
    .string()
    .min(
      6,
      m.schema_validation_string_min({
        field: m.model_auth_field_username(),
        min: 6,
      }),
    )
    .max(
      50,
      m.schema_validation_string_max({
        field: m.model_auth_field_username(),
        max: 50,
      }),
    )
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      m.schema_validation_common_invalid({
        field: m.model_auth_field_username(),
      }),
    )
}

export const updateAccountFormSchema = () => {
  return z.object({
    username: usernameValidation(),
    image: z
      .instanceof(File, {
        message: capitalizeSentence(
          m.schema_validation_file_invalid_type({
            field: m.model_user_field_image(),
            allowedTypes: 'image/*',
          }),
        ),
      })
      .refine(
        (file) => file.size <= 2 * 1024 * 1024, // max 2 MB
        {
          message: capitalizeSentence(
            m.schema_validation_file_max_size({
              field: m.model_user_field_image(),
              maxSize: 2,
            }),
          ),
        },
      )
      .refine(
        (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
        {
          message: capitalizeSentence(
            m.schema_validation_file_invalid_type({
              field: m.model_user_field_image(),
              allowedTypes: 'JPEG, PNG, or WEBP',
            }),
          ),
        },
      )
      .optional()
      .nullable(),
  })
}

export const updatePasswordFormSchema = (providers: LoginProvider[]) => {
  const hasCredentials = providers.includes('CREDENTIALS')

  const passwordField = m.model_auth_field_password()

  return z
    .object({
      currentPassword: hasCredentials
        ? z.string().min(
            1,
            capitalizeSentence(
              m.schema_validation_common_required({
                field: passwordField,
              }),
            ),
          )
        : z.string().optional(),
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

export const deleteAccountFormSchema = () => {
  const passwordField = m.model_auth_field_password()
  return z.object({
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
