import { Heading } from '@/components'
import { ActionLink } from '@/components/elements'
import {
  MainLayout,
  PageContainer,
  SectionContainer,
} from '@/components/layouts'
import * as m from '@/generated/paraglide/messages'
import { useQueryParams } from '@/hooks'
import { useTRPC } from '@/lib/trpc/react'
import { useQuery } from '@tanstack/react-query'
import { UrlListSection } from '../components'
import { useUrlListActions } from '../hooks'

export const UrlPage = () => {
  const trpc = useTRPC()

  const { queryParams, handleUpdateQuery } = useQueryParams()

  const { data: urls, isLoading: isUrlsLoading } = useQuery(
    trpc.url.getAll.queryOptions({ params: { ...queryParams } }),
  )

  const urlListActions = useUrlListActions(urls?.data.map((u) => u.id) ?? [])

  return (
    <PageContainer withHeader withFooter>
      <SectionContainer container padded className="min-h-screen">
        <MainLayout
          headerContent={
            <>
              <Heading size={'h2'}>{m.page_url_title()}</Heading>
              {urls?.meta && urls.meta.total > 0 && (
                <ActionLink
                  action="createNew"
                  to="/{-$locale}/dashboard/url/create"
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
          />
        </MainLayout>
      </SectionContainer>
    </PageContainer>
  )
}
