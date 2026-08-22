import { DetailPlatformPage } from '@/features/platform/pages'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/{-$locale}/_authenticated/dashboard/platform/$id/view',
)({
  component: DetailPlatformPage,
})
