import { env } from '@/configs/env'
import { createFileRoute, notFound, redirect } from '@tanstack/react-router'
import { TRPCClientError } from '@trpc/client'

export const Route = createFileRoute('/{-$locale}/_public/i/$suffix')({
  loader: async ({ context, params }) => {
    const { queryClient, trpc } = context
    const { suffix } = params
    try {
      const identifier = await queryClient.query(
        trpc.identifier.getPublicBySlugSuffix.queryOptions({ suffix }),
      )

      throw redirect({
        href: `${env.VITE_BASE_URL}/${identifier.user.username}/identifier/${identifier.slug}`,
      })
    } catch (error) {
      if (
        error instanceof TRPCClientError &&
        error.data?.code === 'NOT_FOUND'
      ) {
        throw notFound()
      }
      throw error instanceof TRPCClientError ? new Error(error.message) : error
    }
  },
})
