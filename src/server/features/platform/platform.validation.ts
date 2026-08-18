import { visibility } from '@/server/validations'
import z from 'zod'

export const basePlatformRequest = z.object({
  title: z.string().min(1).max(100).trim(),
  slug: z
    .string()
    .min(1)
    .max(150)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  url: z.url().min(1).trim(),
  visibility: z.enum(visibility).default('PRIVATE'),
  password: z.string().max(255).trim().optional().nullable().default(null),
  thumbnail: z.url().optional().nullable().default(null),
  userId: z.uuid(),
})

export const createPlatformRequest = basePlatformRequest.omit({
  slug: true,
  userId: true,
})

export const updatePlatformRequest = basePlatformRequest.omit({
  slug: true,
  userId: true,
})

export const deletePlatformRequest = z.object({
  id: z.uuid().min(1),
})

export const bulkDeletePlatformsRequest = z.object({
  ids: z.array(z.uuid()).min(1),
})
