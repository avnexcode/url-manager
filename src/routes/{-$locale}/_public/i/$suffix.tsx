import { env } from '@/configs/env'
import { createFileRoute, notFound, redirect } from '@tanstack/react-router'
import { TRPCClientError } from '@trpc/client'

export const Route = createFileRoute('/{-$locale}/_public/i/$suffix')({
  loader: async ({ context, params }) => {
    const { trpc, queryClient } = context
    const { suffix } = params

    try {
      const identifier = await queryClient.ensureQueryData(
        trpc.identifier.getPublicBySlugSuffix.queryOptions({ suffix }),
      )

      const {
        user: { username },
        slug,
      } = identifier

      throw redirect({
        href: `${env.VITE_BASE_URL}/${username}/identifier/${slug}`,
      })
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
