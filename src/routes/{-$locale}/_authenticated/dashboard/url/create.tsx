import { CreateUrlPage } from '@/features/url/pages'
import * as m from '@/generated/paraglide/messages'
import { seo } from '@/routes/__root'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

export const urlSearchSchema = z.object({
  from: z.enum(['platform', 'identifier']).optional(),
  id: z.uuid().optional(),
})

export type UrlSearchSchema = z.infer<typeof urlSearchSchema>

export const Route = createFileRoute(
  '/{-$locale}/_authenticated/dashboard/url/create',
)({
  head: () =>
    seo({
      title: `${m.action_create_new()} ${m.page_url_title()}`,
      robots: false,
    }),
  validateSearch: urlSearchSchema,
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
