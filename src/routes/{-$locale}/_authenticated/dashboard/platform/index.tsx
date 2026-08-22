import { PlatformPage } from '@/features/platform/pages'
import { searchSchema } from '@/hooks'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/{-$locale}/_authenticated/dashboard/platform/',
)({
  validateSearch: searchSchema,
  component: PlatformPage,
})
