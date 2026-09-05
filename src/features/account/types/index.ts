import type { Prisma } from '@/generated/prisma/browser'
import type z from 'zod'
import type {
  updatePasswordFormSchema,
  deleteAccountFormSchema,
  updateAccountFormSchema,
} from '../schemas'

export type UpdateAccountFormSchema = z.infer<
  ReturnType<typeof updateAccountFormSchema>
>

export type UpdatePasswordFormSchema = z.infer<
  ReturnType<typeof updatePasswordFormSchema>
>

export type DeleteAccountFormSchema = z.infer<
  ReturnType<typeof deleteAccountFormSchema>
>

export type UserResponse = Prisma.UserGetPayload<{}>
