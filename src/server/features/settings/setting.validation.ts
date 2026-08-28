import { language, theme } from '@/server/validations'
import z from 'zod'

export const createSettingRequest = z.object({
  theme: z.enum(theme).default('SYSTEM').optional(),
  language: z.enum(language).default('ID').optional(),
  publicAccess: z.boolean().default(true).optional(),
  publicPlatformAccess: z.boolean().default(true).optional(),
  publicIdentifierAccess: z.boolean().default(true).optional(),
})

export const updateSettingRequest = z.object({
  theme: z.enum(theme).optional(),
  language: z.enum(language).optional(),
  publicAccess: z.boolean().optional(),
  publicPlatformAccess: z.boolean().optional(),
  publicIdentifierAccess: z.boolean().optional(),
})

export const deleteSettingRequest = z.object({
  userId: z.uuid().min(1),
})
