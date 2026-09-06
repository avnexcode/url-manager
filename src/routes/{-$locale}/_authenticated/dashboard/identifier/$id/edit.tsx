import { EditIdentifierPage } from '@/features/identifier/pages'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/{-$locale}/_authenticated/dashboard/identifier/$id/edit',
)({
  component: EditIdentifierPage,
})
