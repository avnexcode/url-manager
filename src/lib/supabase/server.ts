import { env } from '@/configs/env'
import type { CookieOptions } from '@supabase/ssr'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { getCookies, setCookie } from '@tanstack/react-start/server'

import { parse, serialize } from 'cookie-es'

const serializeCookie = (
  name: string,
  value: string,
  options?: CookieOptions,
): string => {
  return serialize(name, value, {
    ...options,
    path: options?.path ?? '/',
  })
}

const createSSRClientDefault = () => {
  return createServerClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return Object.entries(getCookies()).map(([name, value]) => ({
          name,
          value,
        }))
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          setCookie(name, value, options)
        })
      },
    },
  })
}

// createSSRClientFromRequest

const createSSRClientExplicit = (
  request: Request,
  responseHeaders: Headers,
) => {
  return createServerClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        const cookieHeader = request.headers.get('cookie') ?? ''
        const parsed = parse(cookieHeader)
        return Object.entries(parsed).map(([name, value]) => ({
          name,
          value: value ?? '',
        }))
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
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
