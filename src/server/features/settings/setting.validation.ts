import { language, theme } from '@/server/validations'
import z from 'zod'

export const createSettingRequest = z.object({
  theme: z.enum(theme).optional(),
  language: z.enum(language).optional(),
  publicAccess: z.boolean().optional(),
  publicPlatformAccess: z.boolean().optional(),
  publicIdentifierAccess: z.boolean().optional(),
})

export const updateSettingRequest = createSettingRequest.partial()

export const deleteSettingRequest = z.object({
  userId: z.uuid().min(1),
})
