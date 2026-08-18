import { PlatformPage } from '@/features/platform/pages'
import * as m from '@/generated/paraglide/messages'
import { searchSchema } from '@/hooks'
import { capitalizeSentence } from '@/utils'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/{-$locale}/_authenticated/dashboard/platform/',
)({
  head: () => ({
    meta: [{ title: capitalizeSentence(m.model_platform_title()) }],
  }),
  validateSearch: searchSchema,
  component: PlatformPage,
})
