import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/{-$locale}/_authenticated/dashboard/platform/$id/',
)({
  beforeLoad: ({ params }) => {
    throw redirect({ to: '/{-$locale}/dashboard/platform/$id/view', params })
  },
})
