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

export const Route = createFileRoute('/{-$locale}/_public/s/$suffix')({
  loader: async ({ context, params }) => {
    const { queryClient, trpc } = context
    const { suffix } = params

    try {
      const data = await queryClient.ensureQueryData(
        trpc.url.getPublicBySlugSuffix.queryOptions({ suffix }),
      )

      if (!(await getIsBot())) {
        throw redirect({ href: data.url })
      }

      return {
        url: data,
        shortUrl: `${env.VITE_BASE_URL}/s/${suffix}`,
      }
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
        ? capitalizeFirstLetter(loaderData.url.title)
        : m.page_url_title(),
      description: loaderData?.url.description ?? undefined,
      image: loaderData?.url.thumbnail ?? undefined,
      url: loaderData?.shortUrl,
    }),
})
