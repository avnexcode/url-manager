import { Heading } from '@/components'
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
        <MainLayout
          headerContent={
            <Heading size={'h2'}>{m.page_dashboard_title()}</Heading>
          }
        >
          <main className="grid xl:grid-cols-2 grid-cols-1 gap-15 place-items-center">
            <DashboardLink
              label={m.model_platform_title()}
              url="/{-$locale}/dashboard/platform"
            />
            <DashboardLink
              label={m.model_identifier_title()}
              url="/{-$locale}/dashboard/identifier"
            />
            <DashboardLink
              label={m.model_url_title()}
              url="/{-$locale}/dashboard/url"
            />
          </main>
        </MainLayout>
      </SectionContainer>
    </PageContainer>
  )
}
