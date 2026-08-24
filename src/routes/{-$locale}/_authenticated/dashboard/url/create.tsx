import { CreateUrlPage } from '@/features/url/pages'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

export const createUrlSearchSchema = z.object({
  from: z.enum(['platform', 'identifier']).optional(),
  id: z.uuid().optional(),
})

export type CreateUrlSearchSchema = z.infer<typeof createUrlSearchSchema>

export const Route = createFileRoute(
  '/{-$locale}/_authenticated/dashboard/url/create',
)({
  validateSearch: createUrlSearchSchema,
  beforeLoad: ({ search }) => {
    const isIncomplete = Boolean(search.from) !== Boolean(search.id)

    if (isIncomplete) {
      throw redirect({
        to: '/{-$locale}/dashboard/url/create',
        search: {},
        replace: true,
      })
    }
  },
  component: CreateUrlPage,
})
