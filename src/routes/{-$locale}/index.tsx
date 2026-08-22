import { HomePage } from '@/features/home/pages'
import * as m from '@/generated/paraglide/messages'
import { createFileRoute } from '@tanstack/react-router'
import { seo } from '../__root'

export const Route = createFileRoute('/{-$locale}/')({
  head: () => seo({ title: m.page_home_title() }),
  component: HomePage,
})
