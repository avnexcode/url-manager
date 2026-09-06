import { EditUrlPage } from '@/features/url/pages'
import { EditUrlPageSkeleton } from '@/features/url/skeletons'
import * as m from '@/generated/paraglide/messages'
import { seo } from '@/utils'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { urlSearchSchema } from '../create'

export const Route = createFileRoute(
  '/{-$locale}/_authenticated/dashboard/url/$id/edit',
)({
  head: () =>
    seo({
      title: `${m.action_edit()} ${m.page_url_title()}`,
      robots: false,
    }),
  validateSearch: urlSearchSchema,
  beforeLoad: ({ search, params }) => {
    const isIncomplete = Boolean(search.from) !== Boolean(search.id)
    const { id } = params

    if (isIncomplete) {
      throw redirect({
        to: '/{-$locale}/dashboard/url/$id/edit',
        params: { id },
        search: {},
        replace: true,
      })
    }
  },
  component: EditUrlPage,
  pendingComponent: EditUrlPageSkeleton,
})
