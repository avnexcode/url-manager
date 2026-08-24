import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/{-$locale}/_authenticated/dashboard/identifier/$id/',
)({
  beforeLoad: ({ params }) => {
    throw redirect({ to: '/{-$locale}/dashboard/identifier/$id/view', params })
  },
})
