import { Heading } from '@/components'
import {
  MainLayout,
  PageContainer,
  SectionContainer,
} from '@/components/layouts'
import { EditUrlFormSkeleton } from '@/features/url/forms'
import { EditUrlPage } from '@/features/url/pages'
import * as m from '@/generated/paraglide/messages'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/{-$locale}/_authenticated/dashboard/url/$id/edit',
)({
  component: EditUrlPage,
  pendingComponent: () => {
    return (
      <PageContainer withHeader withFooter>
        <SectionContainer container padded className="min-h-screen">
          <MainLayout
            headerContent={<Heading size={'h2'}>{m.page_url_title()}</Heading>}
          >
            <EditUrlFormSkeleton />
          </MainLayout>
        </SectionContainer>
      </PageContainer>
    )
  },
  pendingMs: 300,
  pendingMinMs: 500,
})
