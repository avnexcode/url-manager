import type z from 'zod'
import type { updateAccountFormSchema } from '../schemas'
import type { Prisma } from '@/generated/prisma/client'

export type UpdateAccountFormSchema = z.infer<typeof updateAccountFormSchema>

export type UserResponse = Prisma.UserGetPayload<{}>
