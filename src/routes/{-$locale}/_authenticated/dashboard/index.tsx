import { DashboardPage } from '@/features/dashboard/pages'
import * as m from '@/generated/paraglide/messages'
import { seo } from '@/routes/__root'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/{-$locale}/_authenticated/dashboard/')({
  head: () => seo({ title: m.page_dashboard_title() }),
  component: DashboardPage,
})
