import type { Prisma } from '@/generated/prisma/browser'
import type z from 'zod'
import type { createUrlFormSchema, updateUrlFormSchema } from '../schemas'

export type CreateUrlFormSchema = z.infer<
  ReturnType<typeof createUrlFormSchema>
>

export type UpdateUrlFormSchema = z.infer<
  ReturnType<typeof updateUrlFormSchema>
>

export type UrlResponse = Prisma.UrlGetPayload<{
  omit: { userId: true }
  include: {
    platform: { select: { title: true } }
    identifier: { select: { title: true } }
  }
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
