import { env } from '@/configs/env'
import * as m from '@/generated/paraglide/messages'
import { getIsBot } from '@/lib/is-bot'
import { capitalizeFirstLetter, seo } from '@/utils'
import { createFileRoute, notFound, redirect } from '@tanstack/react-router'
import { TRPCClientError } from '@trpc/client'

export const Route = createFileRoute('/{-$locale}/_public/p/$suffix')({
  loader: async ({ context, params }) => {
    const { queryClient, trpc } = context

    try {
      const platform = await queryClient.ensureQueryData(
        trpc.platform.getPublicBySlugSuffix.queryOptions({
          suffix: params.suffix,
        }),
      )

      const redirectUrl = `${env.VITE_BASE_URL}/${platform.user.username}/platform/${platform.slug}`

      const isBot = await getIsBot()

      if (!isBot) {
        throw redirect({ href: redirectUrl })
      }

      return { platform, redirectUrl }
    } catch (error) {
      if (error instanceof Response || (error as any)?.isRedirect) throw error

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
        ? capitalizeFirstLetter(loaderData.platform.title)
        : m.page_platform_title(),
      image: loaderData?.platform.thumbnail ?? undefined,
      url: loaderData?.redirectUrl,
    }),
})
