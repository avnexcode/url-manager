import type { Prisma } from '@/generated/prisma/client'
import type z from 'zod'
import type { createUrlFormSchema, updateUrlFormSchema } from '../schemas'

export type CreateUrlFormSchema = z.infer<typeof createUrlFormSchema>
export type UpdateUrlFormSchema = z.infer<typeof updateUrlFormSchema>

export type UrlResponse = Prisma.UrlGetPayload<{
  omit: { userId: true }
}>

export type PublicUrlResponse = Prisma.UrlGetPayload<{
  select: {
    title: true
    slug: true
    url: true
    description: true
    thumbnail: true
    user: { select: { username: true } }
  }
}>
