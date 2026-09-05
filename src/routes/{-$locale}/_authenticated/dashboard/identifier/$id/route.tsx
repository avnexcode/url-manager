import { env } from '@/configs/env'
import * as m from '@/generated/paraglide/messages'
import { seo } from '@/routes/__root'
import { capitalizeFirstLetter } from '@/utils'
import { createFileRoute, notFound, Outlet } from '@tanstack/react-router'
import { TRPCClientError } from '@trpc/client'

export const Route = createFileRoute(
  '/{-$locale}/_authenticated/dashboard/identifier/$id',
)({
  loader: async ({ context, params }) => {
    const { id } = params
    try {
      const identifier = await context.queryClient.ensureQueryData(
        context.trpc.identifier.getById.queryOptions({ id }),
      )
      return identifier
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
      title: loaderData
        ? `${capitalizeFirstLetter(loaderData.title)}`
        : m.page_identifier_title(),
      description: loaderData?.description ?? undefined,
      image: loaderData?.thumbnail ?? undefined,
      url: `${env.VITE_BASE_URL}/identifier/${loaderData?.slug ?? params.id}`,
      robots: false,
    }),
  component: () => <Outlet />,
})
