import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { AuthContext } from '@/contexts'
import { m } from '@/generated/paraglide/messages'
import type { Locale } from '@/generated/paraglide/runtime'
import { getLocale, locales, setLocale } from '@/generated/paraglide/runtime'
import type { Language } from '@/generated/prisma/enums'
import { saveLocaleToStorage } from '@/providers'
import { renderElements } from '@/utils'
import * as Flag from 'country-flag-icons/react/3x2'
import { Globe } from 'lucide-react'
import { useContext } from 'react'
import { useLanguage } from '../hooks'

export const ParaglideLocaleSelect = () => {
  const currentLocale = getLocale()

  const authCtx = useContext(AuthContext)
  const isAuthenticated = authCtx?.isAuthenticated ?? false
  const setting = authCtx?.setting

  const { handleLanguageChange, isPending } = useLanguage()

  const handleSelectChange = (value: string | null) => {
    if (!value) return
    const locale = value as Locale

    setLocale(locale)

    if (isAuthenticated && setting?.id) {
      handleLanguageChange(locale.toUpperCase() as Language)
    } else {
      saveLocaleToStorage(locale)
    }
  }

  const localeNames: Record<Locale, string> = {
    en: m.language_en(),
    id: m.language_id(),
  }

  const flags: Record<Locale, React.ReactNode> = {
    en: <Flag.US className="size-5 rounded-sm" />,
    id: <Flag.ID className="size-5 rounded-sm" />,
  }

  return (
    <Select
      value={currentLocale}
      onValueChange={handleSelectChange}
      disabled={isPending}
    >
      <SelectTrigger
        aria-label={m.action_select({ model: m.common_language() })}
        className="h-10 w-auto gap-2 rounded-none border-2 border-border bg-secondary-background px-3 shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-secondary-foreground"
      >
        {flags[currentLocale]}
        <span className="uppercase">{currentLocale}</span>
      </SelectTrigger>
      <SelectContent
        variant={'neutral'}
        position="popper"
        sideOffset={2}
        align="end"
      >
        {renderElements({
          of: Array.from(locales),
          keyExtractor: (locale) => locale,
          render: (locale) => {
            return (
              <SelectItem
                variant={'neutral'}
                value={locale}
                className="cursor-pointer py-2 capitalize"
              >
                {flags[locale] ?? <Globe className="size-4" />}
                {localeNames[locale]}
              </SelectItem>
            )
          },
        })}
      </SelectContent>
    </Select>
  )
}
