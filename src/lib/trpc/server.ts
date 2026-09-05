import { getRequestHeader } from '@tanstack/react-start/server'

export const getServerHeaders = (): Record<string, string> => {
  try {
    // Only forward the 'cookie' header to internal SSR tRPC calls.
    // Forwarding all headers (host, cdn-loop, cf-ray, etc.) causes Cloudflare
    // to detect request loops or strip/alter the proxied request.
    const cookie = getRequestHeader('cookie')
    if (!cookie) return {}
    return { cookie }
  } catch {
    return {}
  }
}
