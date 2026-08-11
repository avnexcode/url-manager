import * as m from '@/generated/paraglide/messages'
import { capitalizeSentence } from '@/utils'
import z from 'zod'

export const passwordField = m.model_auth_field_password()

export const passwordValidation = z
  .string({
    message: capitalizeSentence(
      m.schema_validation_common_invalid({ field: passwordField }),
    ),
  })
  .min(
    1,
    capitalizeSentence(
      m.schema_validation_common_required({ field: passwordField }),
    ),
  )
  .min(
    8,
    capitalizeSentence(
      m.schema_validation_string_min({ field: passwordField, min: 8 }),
    ),
  )
  .max(
    150,
    capitalizeSentence(
      m.schema_validation_string_max({ field: passwordField, max: 150 }),
    ),
  )
  .regex(
    /[a-z]/,
    capitalizeSentence(
      m.schema_validation_string_regex({
        field: passwordField,
        regex: m.regex_lowercase(),
      }),
    ),
  )
  .regex(
    /[A-Z]/,
    capitalizeSentence(
      m.schema_validation_string_regex({
        field: passwordField,
        regex: m.regex_uppercase(),
      }),
    ),
  )
  .regex(
    /\d/,
    capitalizeSentence(
      m.schema_validation_string_regex({
        field: passwordField,
        regex: m.regex_number(),
      }),
    ),
  )
  .regex(
    /[@$!%*?&]/,
    capitalizeSentence(
      m.schema_validation_string_regex({
        field: passwordField,
        regex: m.regex_special_character(),
      }),
    ),
  )
