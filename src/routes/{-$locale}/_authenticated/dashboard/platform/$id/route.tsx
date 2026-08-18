import { createFileRoute, notFound, Outlet } from '@tanstack/react-router'
import { TRPCClientError } from '@trpc/client'

export const Route = createFileRoute(
  '/{-$locale}/_authenticated/dashboard/platform/$id',
)({
  loader: async ({ context, params }) => {
    const { id } = params
    try {
      await context.queryClient.ensureQueryData(
        context.trpc.platform.getById.queryOptions({ id }),
      )
    } catch (error) {
      if (
        error instanceof TRPCClientError &&
        error.data?.code === 'NOT_FOUND'
      ) {
        throw notFound()
      }
      throw error
    }
  },
  component: () => <Outlet />,
})
