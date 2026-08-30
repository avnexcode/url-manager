import type { Prisma } from '@/generated/prisma/client'
import type z from 'zod'
import type {
  createUpdatePasswordFormSchema,
  deleteAccountFormSchema,
  updateAccountFormSchema,
} from '../schemas'

export type UpdateAccountFormSchema = z.infer<typeof updateAccountFormSchema>

export type UpdatePasswordFormSchema = z.infer<
  ReturnType<typeof createUpdatePasswordFormSchema>
>

export type DeleteAccountFormSchema = z.infer<typeof deleteAccountFormSchema>

export type UserResponse = Prisma.UserGetPayload<{}>
