import { loginProvider } from '@/server/validations'
import z from 'zod'
import { emailValidation } from '../auth/auth.validation'

export const baseUserRequest = z.object({
  username: z.string().min(1).max(50),
  email: emailValidation,
  avatar: z.url().optional().nullable(),
  image: z.url().optional().nullable(),
  provider: z.enum(loginProvider).default('CREDENTIALS'),
})

export const createUserRequest = baseUserRequest.pick({
  email: true,
  avatar: true,
  provider: true,
})

export const updateUserRequest = baseUserRequest.partial().omit({ email: true })

export const deleteUserRequest = z.object({
  id: z.uuid(),
})

export const bulkDeleteUserRequest = z.object({
  ids: z.array(z.uuid()),
})
