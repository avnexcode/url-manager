import { DetailUrlPage } from '@/features/url/pages'
import { DetailUrlPageSkeleton } from '@/features/url/skeletons'
import * as m from '@/generated/paraglide/messages'
import { seo } from '@/utils'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { urlSearchSchema } from '../create'

export const Route = createFileRoute(
  '/{-$locale}/_authenticated/dashboard/url/$id/view',
)({
  head: () =>
    seo({
      title: `${m.action_detail()} ${m.page_url_title()}`,
      robots: false,
    }),
  validateSearch: urlSearchSchema,
  beforeLoad: ({ search, params }) => {
    const isIncomplete = Boolean(search.from) !== Boolean(search.id)
    const { id } = params

    if (isIncomplete) {
      throw redirect({
        to: '/{-$locale}/dashboard/url/$id/view',
        params: { id },
        search: {},
        replace: true,
      })
    }
  },
  component: DetailUrlPage,
  pendingComponent: DetailUrlPageSkeleton,
})
