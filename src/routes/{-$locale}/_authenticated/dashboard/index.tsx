import { DashboardPage } from '@/features/dashboard/pages'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/{-$locale}/_authenticated/dashboard/')(
  {
    head: () => ({
      meta: [{ title: 'Dashboard' }],
    }),
    component: DashboardPage,
  },
)
