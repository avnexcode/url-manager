import { language, theme } from '@/server/validations'
import z from 'zod'

export const createSettingRequest = z.object({
  theme: z.enum(theme).default('SYSTEM').optional(),
  language: z.enum(language).default('ID').optional(),
  notification: z.boolean().default(false).optional(),
  publicAccess: z.boolean().default(false).optional(),
  publicPlatformAccess: z.boolean().default(false).optional(),
  publicIdentifierAccess: z.boolean().default(false).optional(),
})

export const updateSettingRequest = createSettingRequest
  .partial()
  .omit({ theme: true, language: true })
  .extend({
    theme: z.enum(theme).optional(),
    language: z.enum(language).optional(),
  })

export const deleteSettingRequest = z.object({
  id: z.uuid().min(1),
})

export const bulkDeleteSetttingRequest = z.object({
  ids: z.array(z.uuid()),
})
