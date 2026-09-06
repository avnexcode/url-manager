import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import type { Theme as LocalTheme } from '@/contexts/theme-context'
import * as m from '@/generated/paraglide/messages'
import type { Theme as DbTheme } from '@/generated/prisma/enums'
import { useAuth, useTheme as useDefaultTheme } from '@/hooks'
import { renderElements } from '@/utils'
import { Moon, Sun, SunMoon } from 'lucide-react'
import { useTheme } from '../hooks'

const THEMES: LocalTheme[] = ['light', 'dark', 'system']

const localToDbTheme = (t: LocalTheme): DbTheme => {
  if (t === 'light') return 'LIGHT'
  if (t === 'dark') return 'DARK'
  return 'SYSTEM'
}

export const ThemeSelect = () => {
  const { theme, setTheme, setThemeLocal } = useDefaultTheme()
  const { isAuthenticated, isLoading } = useAuth()
  const { handleThemeChange, isPending } = useTheme()

  const LABEL: Record<LocalTheme, string> = {
    light: m.enum_theme_light(),
    dark: m.enum_theme_dark(),
    system: m.enum_theme_system(),
  }

  const ICON: Record<LocalTheme, React.ReactNode> = {
    light: <Sun className="size-4" />,
    dark: <Moon className="size-4" />,
    system: <SunMoon className="size-4" />,
  }

  const handleChangeTheme = (v: LocalTheme) => {
    if (isAuthenticated) {
      setThemeLocal(v)

      handleThemeChange(localToDbTheme(v))
    } else {
      setTheme(v)
    }
  }

  return (
    <Select
      value={theme}
      onValueChange={handleChangeTheme}
      disabled={isPending || isLoading}
    >
      <SelectTrigger
        aria-label={`Theme: ${LABEL[theme]}`}
        className="h-10 w-auto gap-2 rounded-none border-2 border-border bg-secondary-background px-3 shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-secondary-foreground"
      >
        {ICON[theme]}
        <span className="capitalize">{LABEL[theme]}</span>
      </SelectTrigger>
      <SelectContent
        variant={'neutral'}
        position="popper"
        sideOffset={2}
        align="end"
      >
        {renderElements({
          of: THEMES,
          keyExtractor: (t) => t,
          render: (t) => {
            return (
              <SelectItem
                variant={'neutral'}
                value={t}
                className="cursor-pointer py-2 capitalize"
              >
                {ICON[t]}
                {LABEL[t]}
              </SelectItem>
            )
          },
        })}
      </SelectContent>
    </Select>
  )
}
