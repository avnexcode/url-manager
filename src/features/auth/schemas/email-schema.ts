import * as m from '@/generated/paraglide/messages'
import { capitalizeSentence } from '@/utils'
import z from 'zod'

export const emailValidation = () => {
  const emailField = m.model_auth_field_email
  return z
    .email(capitalizeSentence(m.schema_validation_string_email()))
    .min(
      1,
      capitalizeSentence(
        m.schema_validation_common_required({ field: emailField }),
      ),
    )
    .max(
      150,
      capitalizeSentence(
        m.schema_validation_string_max({ field: emailField, max: 150 }),
      ),
    )
    .trim()
    .toLowerCase()
}
