import { env } from '@/configs/env'
import type { CookieOptions } from '@supabase/ssr'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import {
  getCookies,
  setCookie,
  setResponseHeader,
} from '@tanstack/react-start/server'
import { parse as parseCookies } from 'cookie-es'

const serializeCookie = (
  name: string,
  value: string,
  options?: CookieOptions,
): string => {
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`
  if (options?.maxAge != null) cookie += `; Max-Age=${options.maxAge}`
  if (options?.expires)
    cookie += `; Expires=${new Date(options.expires).toUTCString()}`
  if (options?.path ?? '/') cookie += `; Path=${options?.path ?? '/'}`
  if (options?.domain) cookie += `; Domain=${options.domain}`
  if (options?.secure) cookie += '; Secure'
  if (options?.httpOnly) cookie += '; HttpOnly'
  if (options?.sameSite) cookie += `; SameSite=${options.sameSite}`

  return cookie
}

const createSSRClientDefault = () => {
  return createServerClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return Object.entries(getCookies()).map(([name, value]) => {
          return { name, value }
        })
      },
      setAll(cookies, headers) {
        cookies.forEach(({ name, value, options }) => {
          setCookie(name, value, options)
        })

        Object.entries(headers).forEach(([name, value]) => {
          setResponseHeader(name, value)
        })
      },
    },
  })
}

const createSSRClientExplicit = (
  request: Request,
  responseHeaders: Headers,
) => {
  return createServerClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        const cookieHeader = request.headers.get('cookie') ?? ''
        const parsed = parseCookies(cookieHeader)
        return Object.entries(parsed)
          .filter((entry): entry is [string, string] => entry[1] !== undefined)
          .map(([name, value]) => ({ name, value }))
      },
      setAll(
        cookies: { name: string; value: string; options?: CookieOptions }[],
      ) {
        cookies.forEach(({ name, value, options }) => {
          responseHeaders.append(
            'Set-Cookie',
            serializeCookie(name, value, options),
          )
        })
      },
    },
  })
}

export const createSSRClient = (opts?: {
  request?: Request
  responseHeaders?: Headers
}) => {
  if (opts?.request) {
    return createSSRClientExplicit(
      opts.request,
      opts.responseHeaders ?? new Headers(),
    )
  }
  return createSSRClientDefault()
}

export const supabaseAdminClient = createClient(
  env.VITE_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
)
