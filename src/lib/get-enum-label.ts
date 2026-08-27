import * as m from '@/generated/paraglide/messages'
import type {
  Language,
  LoginProvider,
  Theme,
  Visibility,
} from '@/generated/prisma/enums'
import { capitalizeWords } from '@/utils'

const LOGIN_PROVIDER_LABEL: Record<LoginProvider, () => string> = {
  CREDENTIALS: m.enum_login_provider_credentials,
  GOOGLE: m.enum_login_provider_google,
}

export const getLoginProvider = ({
  loginProvider,
}: {
  loginProvider: LoginProvider
}) => {
  return capitalizeWords(LOGIN_PROVIDER_LABEL[loginProvider]())
}

const THEME_LABEL: Record<Theme, () => string> = {
  DARK: m.enum_theme_dark,
  LIGHT: m.enum_theme_light,
  SYSTEM: m.enum_theme_system,
}

export const getTheme = ({ theme }: { theme: Theme }) => {
  return capitalizeWords(THEME_LABEL[theme]())
}

const LANGUAGE_LABEL: Record<Language, () => string> = {
  EN: m.enum_language_en,
  ID: m.enum_language_id,
}

export const getLanguage = ({ language }: { language: Language }) => {
  return capitalizeWords(LANGUAGE_LABEL[language]())
}

const VISIBILITY_LABEL: Record<Visibility, () => string> = {
  PUBLIC: m.enum_visibility_public,
  PRIVATE: m.enum_visibility_private,
}

export const getVisibility = ({ visibility }: { visibility: Visibility }) => {
  return capitalizeWords(VISIBILITY_LABEL[visibility]())
}
