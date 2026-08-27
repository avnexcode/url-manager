import { LoginPage } from '@/features/auth/pages'
import * as m from '@/generated/paraglide/messages'
import { createFileRoute } from '@tanstack/react-router'
import { seo } from '../../__root'

export const Route = createFileRoute('/{-$locale}/_auth/login')({
  head: () => seo({ title: m.page_auth_login_title() }),
  component: LoginPage,
})
