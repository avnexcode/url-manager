import { Heading } from '@/components'
import { ActionLink } from '@/components/elements'
import { MainLayout, SectionLayout } from '@/components/layouts'
import { UrlListSection } from '@/features/url/components'
import { useUrlListActions } from '@/features/url/hooks'
import * as m from '@/generated/paraglide/messages'
import { useQueryParams } from '@/hooks'
import { useTRPC } from '@/lib/trpc/react'
import { Route } from '@/routes/{-$locale}/_authenticated/dashboard/platform/$id/view'
import { useQuery } from '@tanstack/react-query'
import { PlatformView, PlatformViewSkeleton } from '../components'

export const DetailPlatformPage = () => {
  const { id } = Route.useParams()

  const trpc = useTRPC()

  const { data: platform, isLoading: isPlatformLoading } = useQuery(
    trpc.platform.getById.queryOptions({ id }),
  )

  const { queryParams, handleUpdateQuery } = useQueryParams()

  const { data: urls, isLoading: isUrlsLoading } = useQuery(
    trpc.url.getAll.queryOptions({
      params: { ...queryParams },
      relation: { platformId: id },
    }),
  )

  const urlListActions = useUrlListActions(urls?.data.map((u) => u.id) ?? [])

  return (
    <MainLayout
      headerContent={<Heading size={'h2'}>{m.page_platform_title()}</Heading>}
    >
      {isPlatformLoading ? (
        <PlatformViewSkeleton />
      ) : (
        platform && <PlatformView platform={platform} />
      )}

      <SectionLayout
        headerContent={
          <>
            <Heading size="h3">{m.component_view_url_list_heading()}</Heading>
            {urls?.meta && urls.meta.total > 0 && (
              <ActionLink
                size="sm"
                action="createNew"
                to="/{-$locale}/dashboard/url/create"
                search={{ from: 'platform', id }}
              />
            )}
          </>
        }
      >
        <UrlListSection
          urls={urls}
          isUrlsLoading={isUrlsLoading}
          queryParams={queryParams}
          handleUpdateQuery={handleUpdateQuery}
          actions={urlListActions}
          searchParams={{ from: 'platform', id }}
        />
      </SectionLayout>
    </MainLayout>
  )
}
