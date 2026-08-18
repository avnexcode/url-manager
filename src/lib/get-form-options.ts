import * as m from '@/generated/paraglide/messages'
import type { Visibility } from '@/generated/prisma/enums'

export const getVisibilityOptions = () =>
  [
    { label: m.enum_visibility_private(), value: 'PRIVATE' },
    { label: m.enum_visibility_public(), value: 'PUBLIC' },
  ] as const satisfies { label: string; value: Visibility }[]
