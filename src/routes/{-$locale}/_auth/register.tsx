import { RegisterPage } from '@/features/auth/pages'
import * as m from '@/generated/paraglide/messages'
import { createFileRoute } from '@tanstack/react-router'
import { seo } from '../../__root'

export const Route = createFileRoute('/{-$locale}/_auth/register')({
  head: () => seo({ title: m.page_auth_register_title() }),
  component: RegisterPage,
})
