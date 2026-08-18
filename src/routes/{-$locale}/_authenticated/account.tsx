import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/{-$locale}/_authenticated/account')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/-$locale/_authenticated/account"!</div>
}
