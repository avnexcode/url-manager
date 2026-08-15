import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/{-$locale}/_authenticated')({
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({ to: '/{-$locale}/login' })
    }
  },
  component: () => <Outlet />,
})
