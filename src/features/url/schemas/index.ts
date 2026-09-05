import * as m from '@/generated/paraglide/messages'
import { capitalizeSentence } from '@/utils'
import z from 'zod'

export const createUrlFormSchema = () => {
  return z.object({
    title: z
      .string()
      .min(
        1,
        capitalizeSentence(
          m.schema_validation_common_required({
            field: m.model_url_field_title(),
          }),
        ),
      )
      .max(
        100,
        capitalizeSentence(
          m.schema_validation_string_max({
            field: m.model_url_field_title(),
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
            field: m.model_url_field_description(),
            max: 255,
          }),
        ),
      )
      .optional()
      .nullable(),
    url: z.url({
      error: (issue) =>
        issue.input === undefined || issue.input === ''
          ? capitalizeSentence(
              m.schema_validation_common_required({
                field: m.model_url_field_url(),
              }),
            )
          : capitalizeSentence(
              m.schema_validation_string_url({
                field: m.model_url_field_url(),
              }),
            ),
    }),
    thumbnail: z
      .instanceof(File, {
        message: capitalizeSentence(
          m.schema_validation_file_invalid_type({
            field: m.model_url_field_thumbnail(),
            allowedTypes: 'image/*',
          }),
        ),
      })
      .refine(
        (file) => file.size <= 2 * 1024 * 1024, // max 2 MB
        {
          message: capitalizeSentence(
            m.schema_validation_file_max_size({
              field: m.model_url_field_thumbnail(),
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
              field: m.model_url_field_thumbnail(),
              allowedTypes: 'JPEG, PNG, or WEBP',
            }),
          ),
        },
      )
      .optional()
      .nullable(),
    platformId: z
      .uuid({
        message: capitalizeSentence(
          m.schema_validation_string_uuid({
            field: m.model_platform_title(),
          }),
        ),
      })
      .optional()
      .nullable(),
    identifierId: z
      .uuid({
        message: capitalizeSentence(
          m.schema_validation_string_uuid({
            field: m.model_identifier_title(),
          }),
        ),
      })
      .optional()
      .nullable(),
  })
}

export const updateUrlFormSchema = () => {
  return createUrlFormSchema()
}
