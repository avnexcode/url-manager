import type { Prisma } from '@/generated/prisma/browser'
import type z from 'zod'
import type {
  createPlatformFormSchema,
  updatePlatformFormSchema,
} from '../schemas'

export type CreatePlatformFormSchema = z.infer<
  ReturnType<typeof createPlatformFormSchema>
>

export type UpdatePlatformFormSchema = z.infer<
  ReturnType<typeof updatePlatformFormSchema>
>

export type PlatformResponse = Prisma.PlatformGetPayload<{
  omit: { userId: true }
}>

export type PublicPlatformResponse = Prisma.PlatformGetPayload<{
  select: {
    title: true
    slug: true
    url: true
    description: true
    password: true
    thumbnail: true
    user: { select: { username: true } }
  }
}>
