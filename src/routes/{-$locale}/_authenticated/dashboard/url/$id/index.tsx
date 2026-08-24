import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/{-$locale}/_authenticated/dashboard/url/$id/',
)({
  beforeLoad: ({ params }) => {
    throw redirect({ to: '/{-$locale}/dashboard/url/$id/view', params })
  },
})
