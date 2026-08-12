import type { Prisma, Setting } from '@/generated/prisma/client'
import type z from 'zod'
import type {
  bulkDeleteSetttingRequest,
  createSettingRequest,
  deleteSettingRequest,
  updateSettingRequest,
} from './settings.validation'

export type CreateSettingRequest = z.infer<typeof createSettingRequest> & {
  userId: string
}

export type UpdateSettingRequest = z.infer<typeof updateSettingRequest>

export type DeleteSettingRequest = z.infer<typeof deleteSettingRequest>

export type BulkDeleteSettingRequest = z.infer<typeof bulkDeleteSetttingRequest>

export type SettingResponse = Prisma.SettingGetPayload<{
  omit: { userId: true }
}>

export type CreateSettingResponse = Omit<Setting, 'updatedAt' | 'userId'>

export type UpdateSettingResponse = Omit<Setting, 'createdAt' | 'userId'>

export type DeleteSettingResponse = Pick<Setting, 'id'>

export type BulkDeleteSettingResponse = DeleteSettingResponse[]
