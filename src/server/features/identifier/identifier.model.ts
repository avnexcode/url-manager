import type { Identifier, Prisma } from '@/generated/prisma/client'
import type z from 'zod'
import type {
  baseCreateIdentifierRequest,
  baseUpdateIdentifierRequest,
  bulkCreateIdentifiersRequest,
  bulkDeleteIdentifiersRequest,
  createIdentifierRequest,
  deleteIdentifierRequest,
  updateIdentifierRequest,
} from './identifier.validation'

export type BaseCreateIdentifierRequest = z.infer<
  typeof baseCreateIdentifierRequest
>

export type BulkCreateIdentifiersRequest = z.infer<
  typeof bulkCreateIdentifiersRequest
>

export type BaseUpdateIdentifierRequest = z.infer<
  typeof baseUpdateIdentifierRequest
>

export type CreateIdentifierRequest = z.infer<typeof createIdentifierRequest>

export type UpdateIdentifierRequest = z.infer<typeof updateIdentifierRequest>

export type DeleteIdentifierRequest = z.infer<typeof deleteIdentifierRequest>

export type BulkDeleteIdentifiersRequest = z.infer<
  typeof bulkDeleteIdentifiersRequest
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

export type CreateIdentifierResponse = Omit<Identifier, 'userId' | 'updatedAt'>

export type BulkCreateIdentifiersResponse = {
  data: CreateIdentifierResponse[]
  count: number
}

export type UpdateIdentifierResponse = Omit<Identifier, 'userId' | 'createdAt'>

export type DeleteIdentifierResponse = Pick<
  Identifier,
  'id' | 'thumbnail' | 'qrCodeUrl'
>

export type BulkDeleteIdentifiersResponse = DeleteIdentifierResponse[]
