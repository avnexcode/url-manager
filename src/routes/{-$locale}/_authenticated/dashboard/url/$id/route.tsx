import { env } from '@/configs/env'
import * as m from '@/generated/paraglide/messages'
import { seo } from '@/routes/__root'
import { createFileRoute, notFound, Outlet } from '@tanstack/react-router'
import { TRPCClientError } from '@trpc/client'

export const Route = createFileRoute(
  '/{-$locale}/_authenticated/dashboard/url/$id',
)({
  loader: async ({ context, params }) => {
    const { id } = params
    try {
      const url = await context.queryClient.ensureQueryData(
        context.trpc.url.getById.queryOptions({ id }),
      )
      return url
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
  head: ({ loaderData, params }) =>
    seo({
      title: loaderData ? `${loaderData.title}` : m.page_url_title(),
      description: loaderData?.description ? undefined : undefined,
      image: loaderData?.thumbnail ?? undefined,
      url: `${env.VITE_BASE_URL}/url/${loaderData?.slug ?? params.id}`,
      robots: false,
    }),
  component: () => <Outlet />,
})
