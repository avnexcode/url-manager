import * as m from '@/generated/paraglide/messages'
import { capitalizeSentence } from '@/utils'
import z from 'zod'

export const passwordField = m.model_auth_field_password()

export const publicAccessPasswordFormSchema = z.object({
  password: z
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
    ),
})
