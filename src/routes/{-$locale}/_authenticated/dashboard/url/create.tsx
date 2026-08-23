import { CreateUrlPage } from '@/features/url/pages'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/{-$locale}/_authenticated/dashboard/url/create',
)({
  component: CreateUrlPage,
})
