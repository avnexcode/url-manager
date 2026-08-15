import { AppProvider } from '@/components/layouts'
import { Error404Page } from '@/features/error/pages'
import { getLocale } from '@/generated/paraglide/runtime'
import { fetchUser } from '@/lib/supabase/auth'
import type { AppRouter } from '@/server/api/root'
import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, redirect } from '@tanstack/react-router'
import type { TRPCOptionsProxy } from '@trpc/tanstack-react-query'
import type { UserResponse } from '@/server/features/user'
import type { SettingResponse } from '@/server/features/settings'
import appCss from '../styles/styles.css?url'

export interface MyRouterContext {
  queryClient: QueryClient
  trpc: TRPCOptionsProxy<AppRouter>
  user?: { id: string; email: string | undefined; username: string }
  account?: UserResponse
  setting?: SettingResponse
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

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async ({ location }) => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', getLocale())
    }

    const user = await fetchUser()
    const pathname = location.pathname

    if (user && PATHS.PUBLIC_ROUTES.includes(pathname)) {
      throw redirect({ to: PATHS.DEFAULT_REDIRECT })
    }

    return { user: user ?? undefined }
  },
  loader: async ({ context }) => {
    if (!context.user) return {}

    const [account, setting] = await Promise.allSettled([
      context.queryClient.ensureQueryData(
        context.trpc.auth.getAccount.queryOptions(undefined),
      ),
      context.queryClient.ensureQueryData(
        context.trpc.setting.getByUser.queryOptions(undefined),
      ),
    ])

    return {
      account: account.status === 'fulfilled' ? account.value : undefined,
      setting: setting.status === 'fulfilled' ? setting.value : undefined,
    }
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'URL Manager' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  shellComponent: AppProvider,
  notFoundComponent: Error404Page,
})
