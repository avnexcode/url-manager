import { createFileRoute, Outlet } from '@tanstack/react-router'
import * as m from '@/generated/paraglide/messages'
import { seo } from '@/routes/__root'

export const Route = createFileRoute(
  '/{-$locale}/_authenticated/dashboard/identifier',
)({
  head: () =>
    seo({
      title: m.page_identifier_title(),
      description:
        'Manage your identifiers — group and organize your shortened links under categorized slugs.',
      robots: false,
    }),
  component: () => <Outlet />,
})

