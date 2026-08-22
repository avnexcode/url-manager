import { DetailIdentifierPage } from '@/features/identifier/pages'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/{-$locale}/_authenticated/dashboard/identifier/$id/view',
)({
  component: DetailIdentifierPage,
})
