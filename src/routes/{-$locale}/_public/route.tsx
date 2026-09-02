import { PageContainer, SectionContainer } from '@/components/layouts'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/{-$locale}/_public')({
  component: () => {
    return (
      <PageContainer withFooter>
        <SectionContainer container padded className="min-h-screen">
          <Outlet />
        </SectionContainer>
      </PageContainer>
    )
  },
})
