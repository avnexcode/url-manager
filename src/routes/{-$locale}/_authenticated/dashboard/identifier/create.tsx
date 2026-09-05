import { CreateIdentifierPage } from '@/features/identifier/pages'
import * as m from '@/generated/paraglide/messages'
import { seo } from '@/routes/__root'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/{-$locale}/_authenticated/dashboard/identifier/create',
)({
  head: () =>
    seo({
      title: `Create ${m.page_identifier_title()}`,
      robots: false,
    }),
  component: CreateIdentifierPage,
})

