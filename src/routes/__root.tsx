import { AppProvider } from '@/components/layouts'
import { Error404Page } from '@/features/error/pages'
import { getLocale } from '@/generated/paraglide/runtime'
import { getUser } from '@/lib/supabase/auth'
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
  baseKeywords: [],
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

    return { user: user ?? undefined }
  },
  loader: async ({ context }) => {
    const { trpc, queryClient, user } = context

    if (!user) return {}

    await Promise.all([
      queryClient.ensureQueryData(trpc.auth.getAccount.queryOptions()),
      queryClient.ensureQueryData(trpc.setting.getByUser.queryOptions()),
    ])
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'URL Manager' },
    ],
    links: [
      { rel: 'icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  shellComponent: AppProvider,
  notFoundComponent: Error404Page,
})
