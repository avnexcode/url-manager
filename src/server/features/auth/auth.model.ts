import type { LoginProvider } from '@/generated/prisma/enums'
import type z from 'zod'
import type {
  deleteAccountRequest,
  loginRequest,
  registerRequest,
  resetPasswordRequest,
  updateEmailRequest,
  updatePasswordRequest,
} from './auth.validation'

export type UserMetadata = {
  full_name: string
  name?: string
  avatar_url?: string
  picture?: string
}

export type AppMetadata = {
  providers: LoginProvider[]
}

export type RegisterRequest = z.infer<typeof registerRequest>

export type LoginRequest = z.infer<typeof loginRequest>

export type UpdateEmailRequest = z.infer<typeof updateEmailRequest>

export type UpdatePasswordRequest = z.infer<typeof updatePasswordRequest>

export type ResetPasswordRequest = z.infer<typeof resetPasswordRequest>

export type DeleteAccountRequest = z.infer<typeof deleteAccountRequest>
