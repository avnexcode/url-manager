import type { Prisma } from '@/generated/prisma/browser'

export type SettingResponse = Prisma.SettingGetPayload<{
  omit: { userId: true }
}>
