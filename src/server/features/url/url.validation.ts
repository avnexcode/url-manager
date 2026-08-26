import z from 'zod'

export const relationParams = z
  .object({
    platformId: z.union([z.string(), z.array(z.string())]).optional(),
    identifierId: z.union([z.string(), z.array(z.string())]).optional(),
  })
  .optional()

export const publicRelationParams = z
  .object({
    platformSlug: z.string().optional(),
    identifierSlug: z.string().optional(),
  })
  .optional()

export const baseCreateUrlRequest = z.object({
  title: z.string().min(1).max(100).trim(),
  slug: z
    .string()
    .min(1)
    .max(150)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().max(255).trim().optional().nullable(),
  url: z.url().min(1).trim(),
  thumbnail: z.url().optional().nullable().default(null),
  qrCodeUrl: z.url(),
  qrEncodedValue: z.url(),
  userId: z.uuid(),
  platformId: z.uuid().optional().nullable(),
  identifierId: z.uuid().optional().nullable(),
})

export const createUrlRequest = baseCreateUrlRequest.omit({
  slug: true,
  qrCodeUrl: true,
  qrEncodedValue: true,
  userId: true,
})

export const bulkCreateUrlsRequest = z
  .array(createUrlRequest)
  .min(1)
  .max(250)
  .refine((items) => new Set(items.map((i) => i.title)).size === items.length, {
    message: 'Duplicate title found in request',
  })

export const baseUpdateUrlRequest = baseCreateUrlRequest.partial()

export const updateUrlRequest = baseUpdateUrlRequest.omit({
  slug: true,
  qrCodeUrl: true,
  qrEncodedValue: true,
  userId: true,
})

export const deleteUrlRequest = z.object({
  id: z.uuid().min(1),
})

export const bulkDeleteUrlsRequest = z.object({
  ids: z.array(z.uuid()).min(1),
})
