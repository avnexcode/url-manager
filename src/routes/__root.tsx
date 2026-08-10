import { AppProvider } from '@/components/layouts'
import { Error404Page } from '@/features/error/pages'
import { getLocale } from '@/generated/paraglide/runtime'
import type { AppRouter } from '@/server/api/root'
import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext } from '@tanstack/react-router'
import type { TRPCOptionsProxy } from '@trpc/tanstack-react-query'

import appCss from '../styles/styles.css?url'

interface MyRouterContext {
  queryClient: QueryClient
  trpc: TRPCOptionsProxy<AppRouter>
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async () => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', getLocale())
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
