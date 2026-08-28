import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'

type ThemeMode = 'light' | 'dark'

export const getInitialMode = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return 'light'
  }

  const stored = window.localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') {
    return stored
  }

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

export const applyThemeMode = (mode: ThemeMode) => {
  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(mode)
  document.documentElement.setAttribute('data-theme', mode)
  document.documentElement.style.colorScheme = mode
}

export const ThemeToggle = () => {
  const [mode, setMode] = useState<ThemeMode>('light')

  useEffect(() => {
    const initialMode = getInitialMode()
    setMode(initialMode)
    applyThemeMode(initialMode)
  }, [])

  const toggleMode = () => {
    const nextMode: ThemeMode = mode === 'light' ? 'dark' : 'light'
    setMode(nextMode)
    applyThemeMode(nextMode)
    window.localStorage.setItem('theme', nextMode)
  }

  const label =
    mode === 'dark'
      ? 'Theme mode: dark. Click to switch to light mode.'
      : 'Theme mode: light. Click to switch to dark mode.'

  return (
    <Button
      onClick={toggleMode}
      aria-label={label}
      title={label}
      variant={'neutral'}
    >
      {mode === 'dark' ? <Moon /> : <Sun />}
    </Button>
  )
}
