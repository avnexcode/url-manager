import { useAuth } from '@/hooks'
import type { Locale } from '@/generated/paraglide/runtime'
import { getLocale, isLocale, localizeUrl } from '@/generated/paraglide/runtime'
import { useEffect } from 'react'

const LOCALE_STORAGE_KEY = 'locale'

/**
 * Menyimpan locale ke localStorage agar bisa dipulihkan
 * ketika user logout dan kembali ke halaman public.
 */
export const saveLocaleToStorage = (locale: Locale) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  }
}

/**
 * Membaca locale dari localStorage.
 * Digunakan oleh halaman public untuk memulihkan locale setelah logout.
 */
export const getStoredLocale = (): Locale | null => {
  if (typeof window === 'undefined') return null
  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY)
  if (stored && isLocale(stored)) return stored
  return null
}

/**
 * Komponen global yang menjaga sinkronisasi locale dari DB ke Paraglide.
 * Di-mount di dalam Providers (_authenticated routes) sehingga aktif
 * di semua halaman setelah login — tanpa perlu mengunjungi halaman setting.
 */
export const LocaleSync = () => {
  const { isAuthenticated, setting } = useAuth()

  useEffect(() => {
    if (!isAuthenticated || !setting) return

    const preferredLocale = setting.language.toLowerCase() as Locale
    if (!isLocale(preferredLocale)) return

    // Persist ke localStorage agar bisa dipulihkan setelah logout
    saveLocaleToStorage(preferredLocale)

    const currentLocale = getLocale()
    if (preferredLocale === currentLocale) return

    // Redirect ke URL dengan locale yang benar
    const localized = localizeUrl(window.location.href, {
      locale: preferredLocale,
    })
    if (localized.href !== window.location.href) {
      window.location.href = localized.href
    }
  }, [isAuthenticated, setting])

  return null
}
