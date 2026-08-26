import { createFileRoute, notFound, redirect } from '@tanstack/react-router'
import { TRPCClientError } from '@trpc/client'

export const Route = createFileRoute('/{-$locale}/_public/s/$suffix')({
  loader: async ({ context, params }) => {
    const { trpc, queryClient } = context
    const { suffix } = params

    try {
      const url = await queryClient.ensureQueryData(
        trpc.url.getPublicBySlugSuffix.queryOptions({ suffix }),
      )

      throw redirect({ href: url.url })
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
})
