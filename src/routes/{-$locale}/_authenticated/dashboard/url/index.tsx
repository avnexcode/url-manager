import { UrlPage } from '@/features/url/pages'
import { searchSchema } from '@/hooks'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/{-$locale}/_authenticated/dashboard/url/',
)({
  validateSearch: searchSchema,
  component: UrlPage,
})
