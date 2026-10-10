import { env } from '@/configs/env'
import * as m from '@/generated/paraglide/messages'
import { getIsBot } from '@/lib/is-bot'
import { capitalizeFirstLetter, seo } from '@/utils'
import {
  createFileRoute,
  isRedirect,
  notFound,
  redirect,
} from '@tanstack/react-router'
import { TRPCClientError } from '@trpc/client'

export const Route = createFileRoute('/{-$locale}/_public/i/$suffix')({
  loader: async ({ context, params }) => {
    const { queryClient, trpc } = context

    try {
      const identifier = await queryClient.ensureQueryData(
        trpc.identifier.getPublicBySlugSuffix.queryOptions({
          suffix: params.suffix,
        }),
      )

      const redirectUrl = `${env.VITE_BASE_URL}/${identifier.user.username}/identifier/${identifier.slug}`

      if (!(await getIsBot())) {
        throw redirect({ href: redirectUrl })
      }

      return { identifier, redirectUrl }
    } catch (error) {
      if (isRedirect(error)) throw error

      if (
        error instanceof TRPCClientError &&
        error.data?.code === 'NOT_FOUND'
      ) {
        throw notFound()
      }
      throw error instanceof TRPCClientError ? new Error(error.message) : error
    }
  },

  head: ({ loaderData }) =>
    seo({
      title: loaderData
        ? capitalizeFirstLetter(loaderData.identifier.title)
        : m.page_identifier_title(),
      image: loaderData?.identifier.thumbnail ?? undefined,
      url: loaderData?.redirectUrl,
    }),
})
