import type z from 'zod'
import type {
  baseUserRequest,
  bulkDeleteUserRequest,
  createUserRequest,
  deleteUserRequest,
  updateUserRequest,
} from './user.validation'
import type { Prisma, User } from '@/generated/prisma/client'

export type BaseUserRequest = z.infer<typeof baseUserRequest>

export type CreateUserRequest = z.infer<typeof createUserRequest>

export type UpdateUserRequest = z.infer<typeof updateUserRequest>

export type DeleteUserRequest = z.infer<typeof deleteUserRequest>

export type BulkDeleteUserRequest = z.infer<typeof bulkDeleteUserRequest>

export type UserResponse = Prisma.UserGetPayload<{}>

export type UpdateUserResponse = Omit<User, 'createdAt'>

export type CreateUserResponse = Omit<User, 'updatedAt'>

export type DeleteUserResponse = Pick<User, 'id' | 'image'>

export type BulkDeleteUserResponse = DeleteUserResponse[]
