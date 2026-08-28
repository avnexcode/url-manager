import type { Prisma, Url } from '@/generated/prisma/client'
import type z from 'zod'
import type {
  baseCreateUrlRequest,
  baseUpdateUrlRequest,
  bulkCreateUrlsRequest,
  bulkDeleteUrlsRequest,
  createUrlRequest,
  deleteUrlRequest,
  publicRelationParams,
  relationParams,
  updateUrlRequest,
} from './url.validation'

export type RelationParams = z.infer<typeof relationParams>

export type PublicRelationParams = z.infer<typeof publicRelationParams>

export type BaseCreateUrlRequest = z.infer<typeof baseCreateUrlRequest>

export type BulkCreateUrlsRequest = z.infer<typeof bulkCreateUrlsRequest>

export type BaseUpdateUrlRequest = z.infer<typeof baseUpdateUrlRequest>

export type CreateUrlRequest = z.infer<typeof createUrlRequest>

export type UpdateUrlRequest = z.infer<typeof updateUrlRequest>

export type DeleteUrlRequest = z.infer<typeof deleteUrlRequest>

export type BulkDeleteUrlsRequest = z.infer<typeof bulkDeleteUrlsRequest>

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

export type CreateUrlResponse = Omit<Url, 'userId' | 'updatedAt'>

export type BulkCreateUrlsResponse = {
  data: CreateUrlResponse[]
  count: number
}

export type UpdateUrlResponse = Omit<Url, 'userId' | 'createdAt'>

export type DeleteUrlResponse = Pick<Url, 'id' | 'thumbnail' | 'qrCodeUrl'>

export type BulkDeleteUrlsResponse = DeleteUrlResponse[]
