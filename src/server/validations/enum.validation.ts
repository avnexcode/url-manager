import {
  Language,
  LoginProvider,
  Theme,
  Visibility,
} from '@/generated/prisma/enums'
import { enumToObject } from '@/utils'

export const loginProvider = enumToObject(LoginProvider)
export const theme = enumToObject(Theme)
export const language = enumToObject(Language)
export const visibility = enumToObject(Visibility)
