import type { Prisma } from '@/generated/prisma/client'
import type z from 'zod'
import type {
  createIdentifierFormSchema,
  updateIdentifierFormSchema,
} from '../schemas'

export type CreateIdentifierFormSchema = z.infer<
  typeof createIdentifierFormSchema
>
export type UpdateIdentifierFormSchema = z.infer<
  typeof updateIdentifierFormSchema
>

export type IdentifierResponse = Prisma.IdentifierGetPayload<{
  omit: { userId: true }
}>
