import { visibility } from '@/server/validations'
import z from 'zod'

export const baseCreateIdentifierRequest = z.object({
  title: z.string().min(1).max(100).trim(),
  slug: z
    .string()
    .min(1)
    .max(150)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().max(2500).trim().optional().nullable(),
  visibility: z.enum(visibility).default('PRIVATE'),
  password: z.string().max(255).trim().optional().nullable().default(null),
  thumbnail: z.url().optional().nullable().default(null),
  qrCodeUrl: z.url(),
  qrEncodedValue: z.url(),
  userId: z.uuid(),
})

export const createIdentifierRequest = baseCreateIdentifierRequest.omit({
  slug: true,
  qrCodeUrl: true,
  qrEncodedValue: true,
  userId: true,
})

export const bulkCreateIdentifiersRequest = z
  .array(createIdentifierRequest)
  .min(1)
  .max(1000)
  .refine((items) => new Set(items.map((i) => i.title)).size === items.length, {
    message: 'Duplicate title found in request',
  })

export const baseUpdateIdentifierRequest = baseCreateIdentifierRequest.partial()

export const updateIdentifierRequest = baseUpdateIdentifierRequest.omit({
  slug: true,
  qrCodeUrl: true,
  qrEncodedValue: true,
  userId: true,
})

export const deleteIdentifierRequest = z.object({
  id: z.uuid().min(1),
})

export const bulkDeleteIdentifiersRequest = z.object({
  ids: z.array(z.uuid()).min(1),
})
