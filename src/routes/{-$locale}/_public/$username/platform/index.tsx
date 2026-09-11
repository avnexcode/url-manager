// import { env } from '@/configs/env'
// import { PlatformPage } from '@/features/platform/pages/public'
// import * as m from '@/generated/paraglide/messages'
// import { seo } from '@/routes/__root'
// import { capitalizeFirstLetter } from '@/utils'
// import { createFileRoute, notFound } from '@tanstack/react-router'
// import { TRPCClientError } from '@trpc/client'

// export const Route = createFileRoute('/{-$locale}/_public/$username/platform/')(
//   {
//     loader: async ({ context, params }) => {
//       const { queryClient, trpc } = context
//       const { username } = params
//       try {
//         const platforms = await queryClient.ensureQueryData(
//           trpc.platform.getPubllicAll.queryOptions({ username, params: {} }),
//         )

//         return { username, platforms }
//       } catch (error) {
//         if (
//           error instanceof TRPCClientError &&
//           error.data?.code === 'NOT_FOUND'
//         ) {
//           throw notFound()
//         }
//         throw error instanceof TRPCClientError
//           ? new Error(error.message)
//           : error
//       }
//     },
//     head: ({ loaderData, params }) =>
//       seo({
//         title: loaderData
//           ? `${capitalizeFirstLetter(loaderData.username)}`
//           : m.page_platform_title(),
//         url: `${env.VITE_BASE_URL}/${params.username}/p/`,
//       }),
//     component: PlatformPage,
//   },
// )
