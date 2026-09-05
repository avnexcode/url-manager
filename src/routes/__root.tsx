import { AppProvider } from '@/components/layouts'
import { Error404Page, Error500Page } from '@/features/error/pages'
import { getLocale, isLocale, localizeUrl } from '@/generated/paraglide/runtime'
import { getUser } from '@/lib/supabase/auth'
import { getStoredLocale } from '@/providers'
import type { AppRouter } from '@/server/api/root'
import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, redirect } from '@tanstack/react-router'
import type { TRPCOptionsProxy } from '@trpc/tanstack-react-query'

import { env } from '@/configs/env'
import { createSeo } from '@/utils'
import appCss from '../styles/styles.css?url'

export interface MyRouterContext {
  queryClient: QueryClient
  trpc: TRPCOptionsProxy<AppRouter>
  user?: { id: string; email: string; username: string }
}

export const PATHS = {
  DEFAULT_REDIRECT: '/dashboard',
  AUTH_REDIRECT: '/login',
  PUBLIC_ROUTES: [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
  ],
}

export const seo = createSeo({
  siteName: env.VITE_APP_TITLE,
  titleTemplate: (title) => `${title} · ${env.VITE_APP_TITLE}`,
  twitterHandle: '@avnexeed',
  defaultImage: env.VITE_OG_IMAGE_URL,
  baseKeywords: ['url manager', 'url shortener', 'link management', 'qr code'],
})

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async ({ location }) => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', getLocale())
    }

    const user = await getUser()
    const pathname = location.pathname

    if (user && PATHS.PUBLIC_ROUTES.includes(pathname)) {
      throw redirect({ to: PATHS.DEFAULT_REDIRECT })
    }

    if (!user && typeof window !== 'undefined') {
      const storedLocale = getStoredLocale()
      const currentLocale = getLocale()

      if (
        storedLocale &&
        isLocale(storedLocale) &&
        storedLocale !== currentLocale
      ) {
        const localized = localizeUrl(window.location.href, {
          locale: storedLocale,
        })
        if (localized.href !== window.location.href) {
          throw redirect({ href: localized.href })
        }
      }
    }

    return { user: user ?? undefined }
  },
  loader: async ({ context }) => {
    const { trpc, queryClient, user } = context

    if (!user) return {}

    await Promise.allSettled([
      queryClient.ensureQueryData(trpc.auth.getAccount.queryOptions()),
      queryClient.ensureQueryData(trpc.setting.getByUser.queryOptions()),
    ])
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: env.VITE_APP_TITLE },
      {
        name: 'description',
        content:
          'URL Manager — shorten links, manage platforms, group identifiers, and generate QR codes all in one place.',
      },
    ],
    links: [
      { rel: 'icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  shellComponent: AppProvider,
  notFoundComponent: Error404Page,
  errorComponent: Error500Page,
})
