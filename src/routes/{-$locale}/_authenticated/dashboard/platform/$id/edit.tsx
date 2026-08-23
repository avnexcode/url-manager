import {
  MainLayout,
  PageContainer,
  SectionContainer,
} from '@/components/layouts'
import { EditPlatformFormSkeleton } from '@/features/platform/forms'
import { EditPlatformPage } from '@/features/platform/pages'
import * as m from '@/generated/paraglide/messages'
import { createFileRoute } from '@tanstack/react-router'
import { Heading } from 'lucide-react'

export const Route = createFileRoute(
  '/{-$locale}/_authenticated/dashboard/platform/$id/edit',
)({
  component: EditPlatformPage,
  pendingComponent: () => {
    return (
      <PageContainer withHeader withFooter>
        <SectionContainer container padded className="min-h-screen">
          <MainLayout
            headerContent={
              <Heading size={'h2'}>{m.page_platform_title()}</Heading>
            }
          >
            <EditPlatformFormSkeleton />
          </MainLayout>
        </SectionContainer>
      </PageContainer>
    )
  },
  pendingMs: 300,
  pendingMinMs: 500,
})
