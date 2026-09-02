import type { Prisma, Setting } from '@/generated/prisma/client'
import type z from 'zod'
import type {
  createSettingRequest,
  deleteSettingRequest,
  updateSettingRequest,
} from './setting.validation'

export type CreateSettingRequest = z.infer<typeof createSettingRequest>

export type UpdateSettingRequest = z.infer<typeof updateSettingRequest>

export type DeleteSettingRequest = z.infer<typeof deleteSettingRequest>

export type SettingResponse = Prisma.SettingGetPayload<{
  omit: { userId: true }
}>

export type CreateSettingResponse = Omit<Setting, 'updatedAt' | 'userId'>

export type UpdateSettingResponse = Omit<Setting, 'createdAt' | 'userId'>

export type DeleteSettingResponse = Pick<Setting, 'id'>
