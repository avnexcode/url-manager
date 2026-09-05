import { SettingPage } from '@/features/setting/pages'
import * as m from '@/generated/paraglide/messages'
import { seo } from '@/routes/__root'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/{-$locale}/_authenticated/setting')({
  head: () =>
    seo({
      title: m.page_setting_title(),
      description:
        'Configure your URL Manager preferences including language, appearance, and public access settings.',
      robots: false,
    }),
  component: SettingPage,
})

