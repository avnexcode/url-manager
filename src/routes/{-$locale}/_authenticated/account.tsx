import { AccountPage } from '@/features/account/pages'
import * as m from '@/generated/paraglide/messages'
import { seo } from '@/routes/__root'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/{-$locale}/_authenticated/account')({
  head: () =>
    seo({
      title: m.page_auth_account_title(),
      description:
        'Manage your URL Manager account — update your profile, password, and linked login providers.',
      robots: false,
    }),
  component: AccountPage,
})

