import type { Prisma, Url } from '@/generated/prisma/client'
import type z from 'zod'
import type {
  baseCreateUrlRequest,
  baseUpdateUrlRequest,
  bulkDeleteUrlsRequest,
  createUrlRequest,
  deleteUrlRequest,
  updateUrlRequest,
} from './url.validation'

export type BaseCreateUrlRequest = z.infer<typeof baseCreateUrlRequest>

export type BaseUpdateUrlRequest = z.infer<typeof baseUpdateUrlRequest>

export type CreateUrlRequest = z.infer<typeof createUrlRequest>

export type UpdateUrlRequest = z.infer<typeof updateUrlRequest>

export type DeleteUrlRequest = z.infer<typeof deleteUrlRequest>

export type BulkDeleteUrlsRequest = z.infer<typeof bulkDeleteUrlsRequest>

export type UrlResponse = Prisma.UrlGetPayload<{
  omit: { userId: true }
}>

export type CreateUrlResponse = Omit<Url, 'userId' | 'updatedAt'>

export type UpdateUrlResponse = Omit<Url, 'userId' | 'createdAt'>

export type DeleteUrlResponse = Pick<Url, 'id' | 'thumbnail' | 'qrCodeUrl'>

export type BulkDeleteUrlsResponse = DeleteUrlResponse[]
