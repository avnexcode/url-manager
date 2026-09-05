import { env } from '@/configs/env'
import { HomePage } from '@/features/home/pages'
import * as m from '@/generated/paraglide/messages'
import { createFileRoute } from '@tanstack/react-router'
import { seo } from '../__root'

export const Route = createFileRoute('/{-$locale}/')({
  head: () =>
    seo({
      title: m.page_home_title(),
      description:
        'URL Manager — shorten links, manage platforms, group identifiers, and generate QR codes all in one place.',
      url: env.VITE_BASE_URL,
    }),
  component: HomePage,
})
