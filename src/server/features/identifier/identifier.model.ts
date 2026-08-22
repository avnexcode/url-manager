import type { Identifier, Prisma } from '@/generated/prisma/client'
import type z from 'zod'
import type {
  baseIdentifierRequest,
  bulkDeleteIdentifiersRequest,
  createIdentifierRequest,
  deleteIdentifierRequest,
  updateIdentifierRequest,
} from './identifier.validation'

export type BaseIdentifierRequest = z.infer<typeof baseIdentifierRequest>

export type CreateIdentifierRequest = z.infer<typeof createIdentifierRequest>

export type UpdateIdentifierRequest = z.infer<typeof updateIdentifierRequest>

export type DeleteIdentifierRequest = z.infer<typeof deleteIdentifierRequest>

export type BulkDeleteIdentifiersRequest = z.infer<
  typeof bulkDeleteIdentifiersRequest
>

export type IdentifierResponse = Prisma.IdentifierGetPayload<{
  omit: { userId: true }
}>

export type CreateIdentifierResponse = Omit<Identifier, 'userId' | 'updatedAt'>

export type UpdateIdentifierResponse = Omit<Identifier, 'userId' | 'createdAt'>

export type DeleteIdentifierResponse = Pick<Identifier, 'id' | 'thumbnail'>

export type BulkDeleteIdentifiersResponse = DeleteIdentifierResponse[]
