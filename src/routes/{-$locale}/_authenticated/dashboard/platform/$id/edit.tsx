import { EditPlatformPage } from '@/features/platform/pages'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/{-$locale}/_authenticated/dashboard/platform/$id/edit',
)({
  component: EditPlatformPage,
})
