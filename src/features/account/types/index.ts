import type { Prisma } from '@/generated/prisma/client'
import type z from 'zod'
import type {
  deleteAccountFormSchema,
  updateAccountFormSchema,
  updatePasswordFormSchema,
} from '../schemas'

export type UpdateAccountFormSchema = z.infer<typeof updateAccountFormSchema>

export type UpdatePasswordFormSchema = z.infer<typeof updatePasswordFormSchema>

export type DeleteAccountFormSchema = z.infer<typeof deleteAccountFormSchema>

export type UserResponse = Prisma.UserGetPayload<{}>
