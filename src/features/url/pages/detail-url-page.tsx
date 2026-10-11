import { Heading } from '@/components'
import { MainLayout } from '@/components/layouts'
import * as m from '@/generated/paraglide/messages'
import { useTRPC } from '@/lib/trpc/react'
import { Route } from '@/routes/{-$locale}/_authenticated/dashboard/url/$id/view'
import { useQuery } from '@tanstack/react-query'
import { UrlView, UrlViewSkeleton } from '../components'

export const DetailUrlPage = () => {
  const { id } = Route.useParams()

  const search = Route.useSearch()

  const trpc = useTRPC()

  const { data: url, isLoading: isUrlLoading } = useQuery(
    trpc.url.getById.queryOptions({ id }),
  )

  return (
    <MainLayout
      headerContent={<Heading size={'h2'}>{m.page_url_title()}</Heading>}
    >
      {isUrlLoading ? (
        <UrlViewSkeleton />
      ) : (
        url && <UrlView url={url} searchParams={search} />
      )}
    </MainLayout>
  )
}
