import type { ResolvedTheme, Theme } from '@/contexts/theme-context'
import { ThemeContext } from '@/contexts/theme-context'
import { useAuth } from '@/hooks/use-auth'
import { useTRPC } from '@/lib/trpc/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'theme'

const dbThemeToTheme = (dbTheme: string | undefined): Theme => {
  switch (dbTheme) {
    case 'LIGHT':
      return 'light'
    case 'DARK':
      return 'dark'
    default:
      return 'system'
  }
}

const themeToDbTheme = (theme: Theme): 'LIGHT' | 'DARK' | 'SYSTEM' => {
  switch (theme) {
    case 'light':
      return 'LIGHT'
    case 'dark':
      return 'DARK'
    default:
      return 'SYSTEM'
  }
}

const getStoredTheme = (): Theme => {
  if (typeof window === 'undefined') return 'system'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored
  }
  return 'system'
}

const resolveTheme = (theme: Theme): ResolvedTheme => {
  if (theme === 'system') {
    return typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }
  return theme
}

const applyTheme = (theme: Theme) => {
  const resolved = resolveTheme(theme)
  const root = document.documentElement

  root.classList.remove('light', 'dark')
  root.classList.add(resolved)
  root.style.colorScheme = resolved

  if (theme === 'system') {
    root.removeAttribute('data-theme')
  } else {
    root.setAttribute('data-theme', theme)
  }
}

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light')

  const { isAuthenticated, setting } = useAuth()

  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const { mutate: updateSetting } = useMutation(
    trpc.setting.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.setting.getByUser.queryKey(),
        })
      },
    }),
  )

  useEffect(() => {
    const stored = getStoredTheme()
    setThemeState(stored)
    applyTheme(stored)
  }, [])

  useEffect(() => {
    if (!isAuthenticated || !setting) return
    const dbTheme = dbThemeToTheme(setting.theme)
    setThemeState(dbTheme)
    applyTheme(dbTheme)
    window.localStorage.setItem(STORAGE_KEY, dbTheme)
  }, [isAuthenticated, setting])

  useEffect(() => {
    setResolvedTheme(resolveTheme(theme))
  }, [theme])

  useEffect(() => {
    if (theme !== 'system') return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      applyTheme('system')
      setResolvedTheme(resolveTheme('system'))
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [theme])

  /** Update DOM + state + localStorage saja — tanpa memanggil DB */
  const setThemeLocal = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    applyTheme(newTheme)
    window.localStorage.setItem(STORAGE_KEY, newTheme)
  }, [])

  /** Update lokal + DB (hanya ketika tidak authenticated, untuk guest) */
  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeLocal(newTheme)

      if (isAuthenticated && setting?.id) {
        updateSetting({
          request: { theme: themeToDbTheme(newTheme) },
        })
      }
    },
    [isAuthenticated, setting?.id, updateSetting, setThemeLocal],
  )

  return (
    <ThemeContext.Provider
      value={{ theme, resolvedTheme, setTheme, setThemeLocal }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
