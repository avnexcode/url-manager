import { PageContainer, SectionContainer } from '@/components/layouts'
import { Providers } from '@/providers'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/{-$locale}/_authenticated')({
  beforeLoad: ({ context }) => {
    const { user } = context

    if (!user) throw redirect({ to: '/{-$locale}/login' })
  },
  component: () => {
    return (
      <Providers>
        <PageContainer withHeader withFooter>
          <SectionContainer container padded className="min-h-screen">
            <Outlet />
          </SectionContainer>
        </PageContainer>
      </Providers>
    )
  },
})
