import { env } from '@/configs/env'
import { createFileRoute, notFound, redirect } from '@tanstack/react-router'
import { TRPCClientError } from '@trpc/client'

export const Route = createFileRoute('/{-$locale}/_public/p/$suffix')({
  loader: async ({ context, params }) => {
    const { queryClient, trpc } = context

    const { suffix } = params

    try {
      const platform = await queryClient.query(
        trpc.platform.getPublicBySlugSuffix.queryOptions({ suffix }),
      )

      throw redirect({
        href: `${env.VITE_BASE_URL}/${platform.user.username}/platform/${platform.slug}`,
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
