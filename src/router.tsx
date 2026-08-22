import { TanstackQueryProvider, getContext } from '@/providers/query-provider'
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import type { ReactNode } from 'react'
import { deLocalizeUrl, localizeUrl } from './generated/paraglide/runtime'
import { routeTree } from './routeTree.gen'

export const getRouter = () => {
  const context = getContext()

  const { queryClient } = context

  const router = createTanStackRouter({
    routeTree,
    rewrite: {
      input: ({ url }) => deLocalizeUrl(url),
      output: ({ url }) => localizeUrl(url),
    },
    context,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,

    Wrap: ({ children }: { children: ReactNode }) => {
      return (
        <TanstackQueryProvider context={context}>
          {children}
        </TanstackQueryProvider>
      )
    },
  })

  setupRouterSsrQueryIntegration({ router, queryClient })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
