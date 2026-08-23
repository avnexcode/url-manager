import {
  MainLayout,
  PageContainer,
  SectionContainer,
} from '@/components/layouts'
import { EditIdentifierFormSkeleton } from '@/features/identifier/forms'
import { EditIdentifierPage } from '@/features/identifier/pages'
import * as m from '@/generated/paraglide/messages'
import { createFileRoute } from '@tanstack/react-router'
import { Heading } from 'lucide-react'

export const Route = createFileRoute(
  '/{-$locale}/_authenticated/dashboard/identifier/$id/edit',
)({
  component: EditIdentifierPage,
  pendingComponent: () => {
    return (
      <PageContainer withHeader withFooter>
        <SectionContainer container padded className="min-h-screen">
          <MainLayout
            headerContent={
              <Heading size={'h2'}>{m.page_identifier_title()}</Heading>
            }
          >
            <EditIdentifierFormSkeleton />
          </MainLayout>
        </SectionContainer>
      </PageContainer>
    )
  },
  pendingMs: 300,
  pendingMinMs: 500,
})
