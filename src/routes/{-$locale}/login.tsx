import { LoginPage } from '@/features/auth/pages'
import * as m from '@/generated/paraglide/messages'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/{-$locale}/login')({
  head: () => ({
    meta: [{ title: m.page_auth_form_login_header_title() }],
  }),
  component: LoginPage,
})
