import type { UserResponse } from '@/features/account/types'
import type { SettingResponse } from '@/features/setting/types'
import { createContext } from 'react'

export type AuthContextProps = {
  isAuthenticated: boolean
  user?: UserResponse
  setting?: SettingResponse
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined,
)
