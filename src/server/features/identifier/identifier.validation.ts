import { visibility } from '@/server/validations'
import z from 'zod'

export const baseIdentifierRequest = z.object({
  title: z.string().min(1).max(100).trim(),
  slug: z
    .string()
    .min(1)
    .max(150)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  visibility: z.enum(visibility).default('PRIVATE'),
  password: z.string().max(255).trim().optional().nullable().default(null),
  thumbnail: z.url().optional().nullable().default(null),
  userId: z.uuid(),
})

export const createIdentifierRequest = baseIdentifierRequest.omit({
  slug: true,
  userId: true,
})

export const updateIdentifierRequest = baseIdentifierRequest.omit({
  slug: true,
  userId: true,
})

export const deleteIdentifierRequest = z.object({
  id: z.uuid().min(1),
})

export const bulkDeleteIdentifiersRequest = z.object({
  ids: z.array(z.uuid()).min(1),
})
