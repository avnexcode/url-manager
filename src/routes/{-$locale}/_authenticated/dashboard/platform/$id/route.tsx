import { env } from '@/configs/env'
import * as m from '@/generated/paraglide/messages'
import { seo } from '@/routes/__root'
import { capitalizeFirstLetter } from '@/utils'
import { createFileRoute, notFound, Outlet } from '@tanstack/react-router'
import { TRPCClientError } from '@trpc/client'

export const Route = createFileRoute(
  '/{-$locale}/_authenticated/dashboard/platform/$id',
)({
  loader: async ({ context, params }) => {
    const { queryClient, trpc } = context
    const { id } = params
    try {
      const platform = await queryClient.ensureQueryData(
        trpc.platform.getById.queryOptions({ id }),
      )

      return { platform }
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
  head: ({ loaderData, params }) =>
    seo({
      title: loaderData
        ? `${capitalizeFirstLetter(loaderData.platform.title)}`
        : m.page_platform_title(),
      description: loaderData?.platform.description ?? undefined,
      image: loaderData?.platform.thumbnail ?? undefined,
      url: `${env.VITE_BASE_URL}/platform/${loaderData?.platform.slug ?? params.id}`,
      robots: false,
    }),
  component: () => <Outlet />,
})
