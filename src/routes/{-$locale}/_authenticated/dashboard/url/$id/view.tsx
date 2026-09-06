import { DetailUrlPage } from '@/features/url/pages'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { urlSearchSchema } from '../create'

export const Route = createFileRoute(
  '/{-$locale}/_authenticated/dashboard/url/$id/view',
)({
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
})
