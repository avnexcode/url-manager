import { createServerFn } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'

const BOT_REGEX =
  /bot|crawler|spider|facebookexternalhit|whatsapp|telegram|twitter|slack|discord|linkedin|preview/i

export const getIsBot = createServerFn({ method: 'GET' }).handler(async () => {
  const ua = getRequestHeader('user-agent') ?? ''

  return BOT_REGEX.test(ua)
})
