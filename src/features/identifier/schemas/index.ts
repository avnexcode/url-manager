import * as m from '@/generated/paraglide/messages'
import { visibility } from '@/server/validations'
import { capitalizeSentence } from '@/utils'
import z from 'zod'

export const createIdentifierFormSchema = z.object({
  title: z
    .string()
    .min(
      1,
      capitalizeSentence(
        m.schema_validation_common_required({
          field: m.model_identifier_field_title(),
        }),
      ),
    )
    .max(
      100,
      capitalizeSentence(
        m.schema_validation_string_max({
          field: m.model_identifier_field_title(),
          max: 100,
        }),
      ),
    ),
  description: z
    .string()
    .max(
      255,
      capitalizeSentence(
        m.schema_validation_string_max({
          field: m.model_identifier_field_description(),
          max: 255,
        }),
      ),
    )
    .optional()
    .nullable(),
  visibility: z.enum(visibility),
  password: z
    .string()
    .max(
      255,
      capitalizeSentence(
        m.schema_validation_string_max({
          field: m.model_identifier_field_password(),
          max: 255,
        }),
      ),
    )
    .optional()
    .nullable(),
  thumbnail: z
    .instanceof(File, {
      message: capitalizeSentence(
        m.schema_validation_file_invalid_type({
          field: m.model_identifier_field_thumbnail(),
          allowedTypes: 'image/*',
        }),
      ),
    })
    .refine(
      (file) => file.size <= 2 * 1024 * 1024, // max 2 MB
      {
        message: capitalizeSentence(
          m.schema_validation_file_max_size({
            field: m.model_identifier_field_thumbnail(),
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
            field: m.model_identifier_field_thumbnail(),
            allowedTypes: 'JPEG, PNG, or WEBP',
          }),
        ),
      },
    )
    .optional()
    .nullable(),
})

export const updateIdentifierFormSchema = createIdentifierFormSchema
