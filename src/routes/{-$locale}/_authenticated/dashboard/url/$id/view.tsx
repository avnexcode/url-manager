import { DetailUrlPageSkeleton } from '@/features/url/skeletons'
import { DetailUrlPage } from '@/features/url/pages'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/{-$locale}/_authenticated/dashboard/url/$id/view',
)({
  component: DetailUrlPage,
  pendingComponent: DetailUrlPageSkeleton,
})
