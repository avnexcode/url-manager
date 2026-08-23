import type { Platform, Prisma } from '@/generated/prisma/client'
import type z from 'zod'
import type {
  baseCreatePlatformRequest,
  baseUpdatePlatformRequest,
  bulkCreatePlatformsRequest,
  bulkDeletePlatformsRequest,
  createPlatformRequest,
  deletePlatformRequest,
  updatePlatformRequest,
} from './platform.validation'

export type BaseCreatePlatformRequest = z.infer<
  typeof baseCreatePlatformRequest
>

export type BulkCreatePlatformsRequest = z.infer<
  typeof bulkCreatePlatformsRequest
>

export type BaseUpdatePlatformRequest = z.infer<
  typeof baseUpdatePlatformRequest
>

export type CreatePlatformRequest = z.infer<typeof createPlatformRequest>

export type UpdatePlatformRequest = z.infer<typeof updatePlatformRequest>

export type DeletePlatformRequest = z.infer<typeof deletePlatformRequest>

export type BulkDeletePlatformsRequest = z.infer<
  typeof bulkDeletePlatformsRequest
>

export type PlatformResponse = Prisma.PlatformGetPayload<{
  omit: { userId: true }
}>

export type CreatePlatformResponse = Omit<Platform, 'userId' | 'updatedAt'>

export type BulkCreatePlatformsResponse = {
  data: CreatePlatformResponse[]
  count: number
}

export type UpdatePlatformResponse = Omit<Platform, 'userId' | 'createdAt'>

export type DeletePlatformResponse = Pick<
  Platform,
  'id' | 'thumbnail' | 'qrCodeUrl'
>

export type BulkDeletePlatformsResponse = DeletePlatformResponse[]
