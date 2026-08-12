import { Language, LoginProvider, Theme } from '@/generated/prisma/enums'
import { enumToObject } from '@/utils'

export const loginProvider = enumToObject(LoginProvider)
export const theme = enumToObject(Theme)
export const language = enumToObject(Language)
