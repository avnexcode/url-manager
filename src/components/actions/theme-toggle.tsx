import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import type { Theme } from '@/contexts/theme-context'
import * as m from '@/generated/paraglide/messages'
import { useTheme } from '@/hooks'
import { Moon, Sun, SunMoon } from 'lucide-react'

const THEMES: Theme[] = ['light', 'dark', 'system']

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()

  const LABEL: Record<Theme, string> = {
    light: m.enum_theme_light(),
    dark: m.enum_theme_dark(),
    system: m.enum_theme_system(),
  }

  const ICON: Record<Theme, React.ReactNode> = {
    light: <Sun className="size-4" />,
    dark: <Moon className="size-4" />,
    system: <SunMoon className="size-4" />,
  }

  const handleChangeTheme = (v: Theme) => setTheme(v)

  return (
    <Select value={theme} onValueChange={handleChangeTheme}>
      <SelectTrigger
        aria-label={`Theme: ${LABEL[theme]}`}
        className="h-10 w-auto gap-2 rounded-none border-2 border-border bg-secondary-background px-3 shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-secondary-foreground"
      >
        {ICON[theme]}
        <span className="capitalize">{LABEL[theme]}</span>
      </SelectTrigger>
      <SelectContent
        position="popper"
        sideOffset={2}
        align="end"
        className="bg-secondary-background text-secondary-foreground"
      >
        {THEMES.map((t) => (
          <SelectItem
            key={t}
            value={t}
            className="cursor-pointer py-2 capitalize"
          >
            {ICON[t]}
            {LABEL[t]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
