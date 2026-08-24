import * as m from '@/generated/paraglide/messages'
import { seo } from '@/routes/__root'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/{-$locale}/_authenticated/dashboard/url',
)({
  head: () => seo({ title: m.page_url_title() }),
  component: () => <Outlet />,
})
