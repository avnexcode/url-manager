import { env } from '@/configs/env'
import * as m from '@/generated/paraglide/messages'
import { seo } from '@/routes/__root'
import { capitalizeFirstLetter } from '@/utils'
import { createFileRoute, notFound, Outlet } from '@tanstack/react-router'
import { TRPCClientError } from '@trpc/client'

export const Route = createFileRoute(
  '/{-$locale}/_authenticated/dashboard/url/$id',
)({
  loader: async ({ context, params }) => {
    const { queryClient, trpc } = context
    const { id } = params
    try {
      const url = await queryClient.ensureQueryData(
        trpc.url.getById.queryOptions({ id }),
      )

      return { url }
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
        ? `${capitalizeFirstLetter(loaderData.url.title)}`
        : m.page_url_title(),
      description: loaderData?.url.description ?? undefined,
      image: loaderData?.url.thumbnail ?? undefined,
      url: `${env.VITE_BASE_URL}/url/${loaderData?.url.slug ?? params.id}`,
      robots: false,
    }),
  component: () => <Outlet />,
})
