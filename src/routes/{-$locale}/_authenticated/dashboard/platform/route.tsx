import { createFileRoute, Outlet } from '@tanstack/react-router'
import * as m from '@/generated/paraglide/messages'
import { seo } from '@/routes/__root'

export const Route = createFileRoute(
  '/{-$locale}/_authenticated/dashboard/platform',
)({
  head: () =>
    seo({
      title: m.page_platform_title(),
      description:
        'Manage your platforms — organize links by social media or web platforms with custom thumbnails.',
      robots: false,
    }),
  component: () => <Outlet />,
})

