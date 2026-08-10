import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { m } from '@/generated/paraglide/messages'
import type { Locale } from '@/generated/paraglide/runtime'
import { getLocale, locales, setLocale } from '@/generated/paraglide/runtime'
import { renderElements } from '@/utils'
import * as Flag from 'country-flag-icons/react/3x2'
import { Globe } from 'lucide-react'

const localeNames: Record<Locale, string> = {
  en: m.language_en(),
  id: m.language_id(),
}

const flags: Record<Locale, React.ReactNode> = {
  en: <Flag.US className="size-5 rounded-sm" />,
  id: <Flag.ID className="size-5 rounded-sm" />,
}

export const ParaglideLocaleSwitcher = () => {
  const currentLocale = getLocale()

  const handleSelectChange = (value: string | null) => {
    if (value !== null) {
      setLocale(value as Locale)
    }
  }

  return (
    <Select value={currentLocale} onValueChange={handleSelectChange}>
      <SelectTrigger
        aria-label={m.action_select({ model: m.common_language() })}
      >
        <span className="flex items-center gap-2 capitalize">
          {flags[currentLocale] ?? <Globe className="size-5" />}
          <span className="uppercase">{currentLocale}</span>
        </span>
      </SelectTrigger>
      <SelectContent position="popper" sideOffset={2} align="end">
        {renderElements({
          of: Array.from(locales),
          keyExtractor: (locale) => locale,
          render: (locale) => {
            return (
              <SelectItem
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
