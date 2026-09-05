import { env } from '@/configs/env'
import type { CookieOptions } from '@supabase/ssr'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { getCookies, setCookie } from '@tanstack/react-start/server'

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

/**
 * Membuat Supabase SSR client secara default, menggunakan getCookies() /
 * setCookie() dari AsyncLocalStorage TanStack Start.
 *
 * Gunakan di dalam `createServerFn` — context request dikelola otomatis
 * oleh runtime TanStack Start sehingga tidak perlu meneruskan Request secara
 * eksplisit.
 *
 * @see createSSRClientFromRequest untuk penggunaan di API route handler
 */
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

/**
 * Membuat Supabase SSR client secara eksplisit dari Web API Request/Headers.
 *
 * Cookie dibaca langsung dari `request.headers` dan token yang diperbarui
 * ditulis ke `responseHeaders` sebagai `Set-Cookie`. Cara ini lebih reliabel
 * di environment serverless (Vercel) di mana AsyncLocalStorage bisa kehilangan
 * context antar handler.
 *
 * @param request - Objek Web API Request dari handler
 * @param responseHeaders - Headers yang akan dikirim ke client (set-cookie ditulis ke sini)
 */
const createSSRClientExplicit = (
  request: Request,
  responseHeaders: Headers,
) => {
  return createServerClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        const cookieHeader = request.headers.get('cookie') ?? ''
        return cookieHeader
          .split(';')
          .map((c) => c.trim())
          .filter(Boolean)
          .map((c) => {
            const idx = c.indexOf('=')
            return {
              name: decodeURIComponent(c.slice(0, idx).trim()),
              value: decodeURIComponent(c.slice(idx + 1).trim()),
            }
          })
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

/**
 * Fungsi adaptif untuk membuat Supabase SSR client.
 *
 * - **Tanpa argumen** `createSSRClient()` → mode default, pakai AsyncLocalStorage
 *   TanStack Start. Cocok untuk `createServerFn`.
 *
 * - **Dengan argumen** `createSSRClient({ request, responseHeaders? })` →
 *   mode eksplisit, baca cookie langsung dari Request. Cocok untuk API route
 *   handler (`server.handlers`) dan tRPC endpoint di lingkungan serverless.
 *
 * @example
 * // createServerFn — tanpa argumen
 * const supabase = createSSRClient()
 *
 * @example
 * // API route handler / tRPC endpoint — dengan argumen
 * const supabase = createSSRClient({ request })
 */
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

/**
 * Alias untuk backward-compatibility.
 * Digunakan di `oauth/callback.ts` dan `auth/callback.ts`.
 *
 * @deprecated Gunakan `createSSRClient({ request, responseHeaders })` sebagai gantinya.
 */
export const createSSRClientFromRequest = (
  request: Request,
  responseHeaders: Headers,
) => createSSRClientExplicit(request, responseHeaders)

export const supabaseAdminClient = createClient(
  env.VITE_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
)
