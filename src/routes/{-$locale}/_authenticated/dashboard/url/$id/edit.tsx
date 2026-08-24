import { EditUrlPageSkeleton } from '@/features/url/skeletons'
import { EditUrlPage } from '@/features/url/pages'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/{-$locale}/_authenticated/dashboard/url/$id/edit',
)({
  component: EditUrlPage,
  pendingComponent: EditUrlPageSkeleton,
  pendingMs: 300,
  pendingMinMs: 500,
})
