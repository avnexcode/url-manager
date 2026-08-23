import { Heading } from '@/components'
import {
  MainLayout,
  PageContainer,
  SectionContainer,
} from '@/components/layouts'
import { IdentifierViewSkeleton } from '@/features/identifier/components'
import { DetailIdentifierPage } from '@/features/identifier/pages'
import * as m from '@/generated/paraglide/messages'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/{-$locale}/_authenticated/dashboard/identifier/$id/view',
)({
  component: DetailIdentifierPage,
  pendingComponent: () => {
    return (
      <PageContainer withHeader withFooter>
        <SectionContainer container padded className="min-h-screen">
          <MainLayout
            headerContent={
              <Heading size={'h2'}>{m.page_identifier_title()}</Heading>
            }
          >
            <IdentifierViewSkeleton />
          </MainLayout>
        </SectionContainer>
      </PageContainer>
    )
  },
  pendingMs: 300,
  pendingMinMs: 500,
})
