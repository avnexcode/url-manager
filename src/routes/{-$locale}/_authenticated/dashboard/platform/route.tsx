import { createFileRoute, Outlet } from '@tanstack/react-router'
import * as m from '@/generated/paraglide/messages'
import { seo } from '@/routes/__root'

export const Route = createFileRoute(
  '/{-$locale}/_authenticated/dashboard/platform',
)({
  head: () => seo({ title: m.page_platform_title() }),
  component: () => <Outlet />,
})
