import type { Prisma } from '@/generated/prisma/client'
import { createContext } from 'react'

export type SettingResponse = Prisma.SettingGetPayload<{
  omit: { userId: true }
}>

export type UserResponse = Prisma.UserGetPayload<{
  select: {
    id: true
    username: true
    email: true
    avatar: true
    image: true
    providers: true
    createdAt: true
    updatedAt: true
  }
}>

export type AuthContextProps = {
  isAuthenticated: boolean
  user?: UserResponse
  setting?: SettingResponse
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined,
)
