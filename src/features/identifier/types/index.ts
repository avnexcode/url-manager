import type { Prisma } from '@/generated/prisma/browser'
import type z from 'zod'
import type {
  createIdentifierFormSchema,
  updateIdentifierFormSchema,
} from '../schemas'

export type CreateIdentifierFormSchema = z.infer<
  ReturnType<typeof createIdentifierFormSchema>
>
export type UpdateIdentifierFormSchema = z.infer<
  ReturnType<typeof updateIdentifierFormSchema>
>

export type IdentifierResponse = Prisma.IdentifierGetPayload<{
  omit: { userId: true }
}>

export type PublicIdentifierResponse = Prisma.IdentifierGetPayload<{
  select: {
    title: true
    slug: true
    description: true
    password: true
    thumbnail: true
    user: { select: { username: true } }
  }
}>
