import { SettingPage } from '@/features/setting/pages'
import * as m from '@/generated/paraglide/messages'
import { seo } from '@/routes/__root'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/{-$locale}/_authenticated/setting')({
  head: () => seo({ title: m.page_setting_title() }),
  component: SettingPage,
})
