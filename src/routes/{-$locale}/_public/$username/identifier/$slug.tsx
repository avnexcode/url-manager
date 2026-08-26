import { env } from '@/configs/env'
import { DetailIdentifierPage } from '@/features/identifier/pages/public'
import * as m from '@/generated/paraglide/messages'
import { seo } from '@/routes/__root'
import { capitalizeFirstLetter } from '@/utils'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { TRPCClientError } from '@trpc/client'

export const Route = createFileRoute(
  '/{-$locale}/_public/$username/identifier/$slug',
)({
  loader: async ({ context, params }) => {
    const { username, slug } = params

    try {
      const identifier = await context.queryClient.ensureQueryData(
        context.trpc.identifier.getPublicBySlug.queryOptions({
          username,
          slug,
        }),
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
      description: loaderData?.description ? undefined : undefined,
      image: loaderData?.thumbnail ?? undefined,
      url: `${env.VITE_BASE_URL}/${params.username}/i/${loaderData?.slug}`,
      robots: false,
    }),
  component: DetailIdentifierPage,
})
