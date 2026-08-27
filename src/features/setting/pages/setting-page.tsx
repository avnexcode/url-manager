import { Heading } from '@/components'
import {
  MainLayout,
  PageContainer,
  SectionContainer,
} from '@/components/layouts'
import * as m from '@/generated/paraglide/messages'
import {
  ParaglideLocaleSelect,
  PublicAccessSwitcher,
  SettingsCard,
  SettingsSection,
  ThemeSelect,
} from '../components'

export const SettingPage = () => {
  return (
    <PageContainer withHeader withFooter>
      <SectionContainer container padded className="min-h-screen">
        <MainLayout
          headerContent={
            <Heading size={'h2'}>{m.page_setting_title()}</Heading>
          }
          className="space-y-5"
        >
          <div className="flex w-full flex-col items-center">
            <SettingsSection
              title={m.page_setting_section_general_title()}
              caption={m.page_setting_section_general_caption()}
            >
              <SettingsCard
                label={m.page_setting_card_language_label()}
                caption={m.page_setting_card_language_caption()}
                icon="Globe"
              >
                <ParaglideLocaleSelect />
              </SettingsCard>
            </SettingsSection>
            <SettingsSection
              title={m.page_setting_section_public_access_title()}
              caption={m.page_setting_section_public_access_caption()}
            >
              <PublicAccessSwitcher />
            </SettingsSection>
            <SettingsSection
              title={m.page_setting_section_appearance_title()}
              caption={m.page_setting_section_appearance_caption()}
            >
              <SettingsCard
                label={m.page_setting_card_theme_label()}
                caption={m.page_setting_card_theme_caption()}
                icon="Palette"
              >
                <ThemeSelect />
              </SettingsCard>
            </SettingsSection>
          </div>
        </MainLayout>
      </SectionContainer>
    </PageContainer>
  )
}
