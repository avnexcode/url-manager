import { env } from '@/configs/env'
import { TRPCProvider } from '@/lib/trpc/react'
import type { AppRouter } from '@/server/api/root'
import { QueryClient } from '@tanstack/react-query'
import { createIsomorphicFn } from '@tanstack/react-start'
import { createTRPCClient, httpBatchStreamLink } from '@trpc/client'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import type { ReactNode } from 'react'
import superjson from 'superjson'

const getUrl = () => {
  if (typeof window !== 'undefined') return '/api/trpc'
  return `${env.SERVER_URL ?? `http://localhost:3000`}/api/trpc`
}

const getHeaders = createIsomorphicFn()
  .client(() => ({}))
  .server(async () => {
    const { getServerHeaders } = await import('@/lib/trpc/server')
    return getServerHeaders()
  })

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchStreamLink({
      transformer: superjson,
      url: getUrl(),
      headers: getHeaders,
    }),
  ],
})

export const getContext = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      dehydrate: { serializeData: superjson.serialize },
      hydrate: { deserializeData: superjson.deserialize },
    },
  })

  const serverHelpers = createTRPCOptionsProxy({
    client: trpcClient,
    queryClient: queryClient,
  })
  const context = {
    queryClient,
    trpc: serverHelpers,
  }

  return context
}

export const TanstackQueryProvider = ({
  children,
  context,
}: {
  children: ReactNode
  context: ReturnType<typeof getContext>
}) => {
  const { queryClient } = context

  return (
    <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
      {children}
    </TRPCProvider>
  )
}
