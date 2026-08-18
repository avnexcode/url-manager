import * as m from '@/generated/paraglide/messages'
import type {
  Language,
  LoginProvider,
  Theme,
  Visibility,
} from '@/generated/prisma/enums'
import { capitalizeWords } from '@/utils'

const LOGIN_PROVIDER_LABEL = {
  CREDENTIALS: m.enum_login_provider_credentials(),
  GOOGLE: m.enum_login_provider_google(),
} as const satisfies Record<LoginProvider, string>

type GetLoginProviderProps = {
  loginProvider: LoginProvider
}

export const getLoginProvider = ({ loginProvider }: GetLoginProviderProps) => {
  return capitalizeWords(LOGIN_PROVIDER_LABEL[loginProvider])
}

const THEME_LABEL = {
  DARK: m.enum_theme_dark(),
  LIGHT: m.enum_theme_light(),
  SYSTEM: m.enum_theme_system(),
} as const satisfies Record<Theme, string>

type GetThemeProps = {
  theme: Theme
}

export const getTheme = ({ theme }: GetThemeProps) => {
  return capitalizeWords(THEME_LABEL[theme])
}

const LANGUAGE_LABEL = {
  EN: m.enum_language_en(),
  ID: m.enum_language_id(),
} as const satisfies Record<Language, string>

type GetLanguageProps = {
  language: Language
}

export const getLanguage = ({ language }: GetLanguageProps) => {
  return capitalizeWords(LANGUAGE_LABEL[language])
}

const VISIBILITY_LABEL = {
  PUBLIC: m.enum_visibility_public(),
  PRIVATE: m.enum_visibility_private(),
} as const satisfies Record<Visibility, string>

type GetVisibilityProps = {
  visibility: Visibility
}

export const getVisibility = ({ visibility }: GetVisibilityProps) => {
  return capitalizeWords(VISIBILITY_LABEL[visibility])
}
