import { DetailIdentifierPage } from '@/features/identifier/pages'
import { DetailIdentifierPageSkeleton } from '@/features/identifier/skeletons'
import { searchSchema } from '@/hooks'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/{-$locale}/_authenticated/dashboard/identifier/$id/view',
)({
  validateSearch: searchSchema,
  component: DetailIdentifierPage,
  pendingComponent: DetailIdentifierPageSkeleton,
  pendingMs: 300,
  pendingMinMs: 500,
})
