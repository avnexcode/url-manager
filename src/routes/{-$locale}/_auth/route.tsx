import { PageContainer, SectionContainer } from '@/components/layouts'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/{-$locale}/_auth')({
  component: () => {
    return (
      <PageContainer>
        <SectionContainer className="flex min-h-screen items-center justify-center">
          <Outlet />
        </SectionContainer>
      </PageContainer>
    )
  },
})
