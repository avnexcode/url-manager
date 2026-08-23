import type { Prisma } from '@/generated/prisma/client'
import type z from 'zod'
import type { createUrlFormSchema, updateUrlFormSchema } from '../schemas'

export type CreateUrlFormSchema = z.infer<typeof createUrlFormSchema>
export type UpdateUrlFormSchema = z.infer<typeof updateUrlFormSchema>

export type UrlResponse = Prisma.UrlGetPayload<{
  omit: { userId: true }
}>
