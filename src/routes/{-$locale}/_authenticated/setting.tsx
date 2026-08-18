import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/{-$locale}/_authenticated/setting')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/-$locale/_authenticated/setting"!</div>
}
