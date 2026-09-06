import type { UrlSearchSchema } from '@/routes/{-$locale}/_authenticated/dashboard/url/create'
import type { LinkProps } from '@tanstack/react-router'

export const getRedirectTo = ({
  from,
  id,
}: UrlSearchSchema): LinkProps['to'] => {
  if (from === 'platform' && id) {
    return `/{-$locale}/dashboard/platform/${id}/view` as LinkProps['to']
  }

  if (from === 'identifier' && id) {
    return `/{-$locale}/dashboard/identifier/${id}/view` as LinkProps['to']
  }

  return '/{-$locale}/dashboard/url'
}
