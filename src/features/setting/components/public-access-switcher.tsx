import { Switch } from '@/components/ui/switch'
import * as m from '@/generated/paraglide/messages'
import { useAuth } from '@/hooks'
import { usePublicAccess } from '../hooks'
import { SettingsCard } from './settings-card'

export const PublicAccessSwitcher = () => {
  const { setting } = useAuth()
  const { handlePublicAccessChange, isPending } = usePublicAccess()

  if (!setting) return null

  return (
    <>
      <SettingsCard label={m.page_setting_card_public_access_label()}>
        <Switch
          checked={setting.publicAccess}
          onCheckedChange={(checked) =>
            handlePublicAccessChange('publicAccess', checked)
          }
          disabled={isPending}
        />
      </SettingsCard>
      <SettingsCard label={m.page_setting_card_public_platform_access_label()}>
        <Switch
          checked={setting.publicPlatformAccess}
          onCheckedChange={(checked) =>
            handlePublicAccessChange('publicPlatformAccess', checked)
          }
          disabled={isPending}
        />
      </SettingsCard>
      <SettingsCard
        label={m.page_setting_card_public_identifier_access_label()}
      >
        <Switch
          checked={setting.publicIdentifierAccess}
          onCheckedChange={(checked) =>
            handlePublicAccessChange('publicIdentifierAccess', checked)
          }
          disabled={isPending}
        />
      </SettingsCard>
    </>
  )
}
