import { RegisterPage } from '@/features/auth/pages'
import * as m from '@/generated/paraglide/messages'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/{-$locale}/register')({
  head: () => ({
    meta: [{ title: m.page_auth_form_register_header_title() }],
  }),
  component: RegisterPage,
})
