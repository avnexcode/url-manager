import {
  MainLayout,
  PageContainer,
  SectionContainer,
} from '@/components/layouts'
import * as m from '@/generated/paraglide/messages'
import { DashboardLink } from '../components'

export const DashboardPage = () => {
  return (
    <PageContainer withHeader withFooter>
      <SectionContainer container padded className="min-h-screen">
        <MainLayout title="Dashboard">
          <main className="grid xl:grid-cols-2 grid-cols-1 gap-15 place-items-center p-10 h-full">
            <DashboardLink
              label={m.model_platform_title()}
              url="/{-$locale}"
              icon="Computer"
            />
            <DashboardLink
              label={m.model_identifier_title()}
              url="/{-$locale}"
              icon="KeyRound"
            />
          </main>
        </MainLayout>
      </SectionContainer>
    </PageContainer>
  )
}
