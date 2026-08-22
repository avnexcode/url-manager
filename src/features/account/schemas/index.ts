import * as m from '@/generated/paraglide/messages'
import { capitalizeSentence } from '@/utils'
import z from 'zod'

export const usernameValidation = z
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

export const updateAccountFormSchema = z.object({
  username: usernameValidation,
  image: z
    .instanceof(File, {
      message: capitalizeSentence(
        m.schema_validation_file_invalid_type({
          field: m.model_platform_field_thumbnail(),
          allowedTypes: 'image/*',
        }),
      ),
    })
    .refine(
      (file) => file.size <= 10 * 1024 * 1024, // max 10 MB
      {
        message: capitalizeSentence(
          m.schema_validation_file_max_size({
            field: m.model_platform_field_thumbnail(),
            maxSize: 10,
          }),
        ),
      },
    )
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      {
        message: capitalizeSentence(
          m.schema_validation_file_invalid_type({
            field: m.model_platform_field_thumbnail(),
            allowedTypes: 'JPEG, PNG, or WEBP',
          }),
        ),
      },
    )
    .optional()
    .nullable(),
})
