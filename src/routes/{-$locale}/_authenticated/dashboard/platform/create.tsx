import { CreatePlatformPage } from '@/features/platform/pages'
import * as m from '@/generated/paraglide/messages'
import { capitalizeSentence } from '@/utils'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/{-$locale}/_authenticated/dashboard/platform/create',
)({
  head: () => ({
    meta: [{ title: capitalizeSentence(m.model_platform_title()) }],
  }),
  component: CreatePlatformPage,
})
