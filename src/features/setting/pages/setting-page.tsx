import { Heading } from '@/components'
import { ParaglideLocaleSwitcher, ThemeToggle } from '@/components/actions'
import {
  MainLayout,
  PageContainer,
  SectionContainer,
} from '@/components/layouts'
import * as m from '@/generated/paraglide/messages'

export const SettingPage = () => {
  return (
    <PageContainer withHeader withFooter>
      <SectionContainer container padded className="min-h-screen">
        <MainLayout
          headerContent={
            <Heading size={'h2'}>{m.page_auth_setting_title()}</Heading>
          }
          className="space-y-5"
        >
          <div className="w-full flex justify-end">
            <ThemeToggle />
          </div>
          <div className="w-full flex justify-end">
            <ParaglideLocaleSwitcher />
          </div>
        </MainLayout>
      </SectionContainer>
    </PageContainer>
  )
}
