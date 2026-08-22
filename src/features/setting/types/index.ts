import type { Prisma } from '@/generated/prisma/client'

export type SettingResponse = Prisma.SettingGetPayload<{
  omit: { userId: true }
}>
