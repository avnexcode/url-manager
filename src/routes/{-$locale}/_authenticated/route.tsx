import { Loader } from '@/components'
import { Providers } from '@/providers'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/{-$locale}/_authenticated')({
  beforeLoad: ({ context }) => {
    const { user } = context

    if (!user) throw redirect({ to: '/{-$locale}/login' })
  },
  component: () => {
    return (
      <Providers>
        <Outlet />
      </Providers>
    )
  },
  pendingComponent: Loader,
  pendingMs: 300,
  pendingMinMs: 500,
})
