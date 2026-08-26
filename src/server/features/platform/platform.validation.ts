import { visibility } from '@/server/validations'
import z from 'zod'

export const baseCreatePlatformRequest = z.object({
  title: z.string().min(1).max(100).trim(),
  slug: z
    .string()
    .min(1)
    .max(150)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().max(255).trim().optional().nullable(),
  url: z.url().min(1).trim(),
  visibility: z.enum(visibility).default('PRIVATE'),
  password: z.string().max(255).trim().optional().nullable().default(null),
  thumbnail: z.url().optional().nullable().default(null),
  qrCodeUrl: z.url(),
  qrEncodedValue: z.url(),
  userId: z.uuid(),
})

export const createPlatformRequest = baseCreatePlatformRequest.omit({
  qrCodeUrl: true,
  qrEncodedValue: true,
  slug: true,
  userId: true,
})

export const bulkCreatePlatformsRequest = z
  .array(createPlatformRequest)
  .min(1)
  .max(250)
  .refine((items) => new Set(items.map((i) => i.title)).size === items.length, {
    message: 'Duplicate title found in request',
  })

export const baseUpdatePlatformRequest = baseCreatePlatformRequest.partial()

export const updatePlatformRequest = baseUpdatePlatformRequest.omit({
  qrCodeUrl: true,
  qrEncodedValue: true,
  slug: true,
  userId: true,
})

export const deletePlatformRequest = z.object({
  id: z.uuid().min(1),
})

export const bulkDeletePlatformsRequest = z.object({
  ids: z.array(z.uuid()).min(1),
})
