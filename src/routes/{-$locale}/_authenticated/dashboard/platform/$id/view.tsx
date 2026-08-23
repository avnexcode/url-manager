import { Heading } from '@/components'
import {
  MainLayout,
  PageContainer,
  SectionContainer,
} from '@/components/layouts'
import { PlatformViewSkeleton } from '@/features/platform/components'
import { DetailPlatformPage } from '@/features/platform/pages'
import * as m from '@/generated/paraglide/messages'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/{-$locale}/_authenticated/dashboard/platform/$id/view',
)({
  component: DetailPlatformPage,
  pendingComponent: () => {
    return (
      <PageContainer withHeader withFooter>
        <SectionContainer container padded className="min-h-screen">
          <MainLayout
            headerContent={
              <Heading size={'h2'}>{m.page_platform_title()}</Heading>
            }
          >
            <PlatformViewSkeleton />
          </MainLayout>
        </SectionContainer>
      </PageContainer>
    )
  },
  pendingMs: 300,
  pendingMinMs: 500,
})
