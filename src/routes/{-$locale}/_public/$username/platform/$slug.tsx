import { env } from '@/configs/env'
import { DetailPlatformPage } from '@/features/platform/pages/public'
import { PublicDetailPlatformPageSkeleton } from '@/features/platform/skeletons'
import * as m from '@/generated/paraglide/messages'
import { seo } from '@/routes/__root'
import { capitalizeFirstLetter } from '@/utils'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { TRPCClientError } from '@trpc/client'
import z from 'zod'

export const publicSearchSchema = z.object({
  password: z.string().optional(),
})

export const Route = createFileRoute(
  '/{-$locale}/_public/$username/platform/$slug',
)({
  validateSearch: publicSearchSchema,
  loader: async ({ context, params }) => {
    const { trpc } = context
    const { username, slug } = params

    try {
      const platform = await context.queryClient.ensureQueryData(
        trpc.platform.getPublicBySlug.queryOptions({ username, slug }),
      )

      return { username, platform }
    } catch (error) {
      if (
        error instanceof TRPCClientError &&
        error.data?.code === 'NOT_FOUND'
      ) {
        throw notFound()
      }
      if (
        error instanceof TRPCClientError &&
        error.data?.code === 'FORBIDDEN'
      ) {
        throw notFound()
      }
      throw error
    }
  },
  head: ({ loaderData, params }) =>
    seo({
      title: loaderData
        ? `${capitalizeFirstLetter(loaderData.platform.title)}`
        : m.page_platform_title(),
      description: loaderData?.platform.description ? undefined : undefined,
      image: loaderData?.platform.thumbnail ?? undefined,
      url: `${env.VITE_BASE_URL}/${params.username}/i/${loaderData?.platform.slug}`,
    }),
  component: DetailPlatformPage,
  pendingComponent: PublicDetailPlatformPageSkeleton,
})
