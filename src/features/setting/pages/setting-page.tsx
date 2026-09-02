import { Heading } from '@/components'
import { MainLayout } from '@/components/layouts'
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
    <MainLayout
      headerContent={<Heading size={'h2'}>{m.page_setting_title()}</Heading>}
      className="space-y-5"
    >
      <div className="flex w-full flex-col items-center">
        <SettingsSection
          title={m.page_setting_section_general_title()}
          caption={m.page_setting_section_general_caption()}
        >
          <SettingsCard label={m.page_setting_card_language_label()}>
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
          <SettingsCard label={m.page_setting_card_theme_label()}>
            <ThemeSelect />
          </SettingsCard>
        </SettingsSection>
      </div>
    </MainLayout>
  )
}
