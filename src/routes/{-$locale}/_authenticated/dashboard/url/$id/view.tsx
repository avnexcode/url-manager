import { Heading } from '@/components'
import {
  MainLayout,
  PageContainer,
  SectionContainer,
} from '@/components/layouts'
import { UrlViewSkeleton } from '@/features/url/components'
import { DetailUrlPage } from '@/features/url/pages'
import * as m from '@/generated/paraglide/messages'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/{-$locale}/_authenticated/dashboard/url/$id/view',
)({
  component: DetailUrlPage,
  pendingComponent: () => {
    return (
      <PageContainer withHeader withFooter>
        <SectionContainer container padded className="min-h-screen">
          <MainLayout
            headerContent={<Heading size={'h2'}>{m.page_url_title()}</Heading>}
          >
            <UrlViewSkeleton />
          </MainLayout>
        </SectionContainer>
      </PageContainer>
    )
  },
  pendingMs: 300,
  pendingMinMs: 500,
})
