import { appRouter } from '@/server/api/root'
import { createTRPCContext } from '@/server/api/trpc'
import { createFileRoute } from '@tanstack/react-router'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

const handler = ({ request }: { request: Request }) => {
  return fetchRequestHandler({
    req: request,
    endpoint: '/api/trpc',
    router: appRouter,
    createContext: () => createTRPCContext(request),
  })
}

export const Route = createFileRoute('/api/trpc/$')({
  server: {
    handlers: { GET: handler, POST: handler },
  },
})
