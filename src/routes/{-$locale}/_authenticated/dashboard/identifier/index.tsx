import { IdentifierPage } from '@/features/identifier/pages'
import { searchSchema } from '@/hooks'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/{-$locale}/_authenticated/dashboard/identifier/',
)({
  validateSearch: searchSchema,
  component: IdentifierPage,
})
