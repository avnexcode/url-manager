import { AppProvider } from '@/components/layouts'
import { Error404Page } from '@/features/error/pages'
import { getLocale } from '@/generated/paraglide/runtime'
import type { UserRole } from '@/lib/supabase/auth'
import { fetchUser } from '@/lib/supabase/auth'
import type { AppRouter } from '@/server/api/root'
import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, redirect } from '@tanstack/react-router'
import type { TRPCOptionsProxy } from '@trpc/tanstack-react-query'
import appCss from '../styles/styles.css?url'

interface MyRouterContext {
  queryClient: QueryClient
  trpc: TRPCOptionsProxy<AppRouter>
  user: { id: string; email?: string; role: UserRole } | null
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

const PROTECTED_ROUTES = ['/admin', '/dashboard']

const matchRoute = (pathname: string, routes: string[]) =>
  routes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async ({ location }) => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', getLocale())
    }

    const user = await fetchUser()
    const pathname = location.pathname

    const isPublicRoute = PATHS.PUBLIC_ROUTES.includes(pathname)
    const isProtectedRoute = matchRoute(pathname, PROTECTED_ROUTES)

    if (user && isPublicRoute) {
      throw redirect({ to: PATHS.DEFAULT_REDIRECT })
    }

    if (!user && isProtectedRoute) {
      throw redirect({ to: PATHS.AUTH_REDIRECT })
    }

    return { user }
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
