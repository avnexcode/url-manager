import { Heading } from '@/components'
import { MainLayout } from '@/components/layouts'
import * as m from '@/generated/paraglide/messages'
import { useTRPC } from '@/lib/trpc/react'
import { Route } from '@/routes/{-$locale}/_authenticated/dashboard/url/$id/view'
import { useSuspenseQuery } from '@tanstack/react-query'
import { UrlView } from '../components'

export const DetailUrlPage = () => {
  const { id } = Route.useParams()
  const trpc = useTRPC()

  const { data: url } = useSuspenseQuery(trpc.url.getById.queryOptions({ id }))

  return (
    <MainLayout
      headerContent={<Heading size={'h2'}>{m.page_url_title()}</Heading>}
    >
      <UrlView url={url} />
    </MainLayout>
  )
}
