import { env } from '@/configs/env'
import type { CookieOptions, CookieOptionsWithName } from '@supabase/ssr'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { getCookies, setCookie } from '@tanstack/react-start/server'

const IS_PRODUCTION = process.env.NODE_ENV === 'production'

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
  // Tambahkan Secure secara otomatis di production (HTTPS)
  if (options?.secure ?? IS_PRODUCTION) cookie += '; Secure'
  if (options?.httpOnly) cookie += '; HttpOnly'
  if (options?.sameSite) cookie += `; SameSite=${options.sameSite}`
  return cookie
}

/**
 * Membangun opsi cookie dengan menerapkan Secure secara otomatis di production.
 */
const withSecure = (options?: CookieOptions): CookieOptionsWithName => {
  return {
    ...options,
    secure: options?.secure ?? IS_PRODUCTION,
  } as CookieOptionsWithName
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
          // Terapkan Secure secara otomatis di production
          setCookie(name, value, withSecure(options))
        })
      },
    },
  })
}

/**
 * Membuat Supabase SSR client secara eksplisit dari Web API Request/Headers.
 *
 * Cookie dibaca langsung dari `request.headers`. Cookie yang diperbarui
 * ditulis melalui dua jalur:
 *   1. `setCookie()` dari TanStack Start — memastikan cookie masuk ke pipeline
 *      H3 event context sehingga runtime Vercel tidak mem-fold beberapa
 *      Set-Cookie menjadi satu header yang rusak.
 *   2. `responseHeaders.append('Set-Cookie', ...)` — sebagai fallback eksplisit
 *      untuk handler yang meneruskan headers sendiri.
 *
 * Flag `Secure` diterapkan secara otomatis di environment production.
 *
 * @param request - Objek Web API Request dari handler
 * @param responseHeaders - Headers yang akan dikirim ke client (Set-Cookie ditulis ke sini)
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
          const cookieOpts = withSecure(options)

          // 1. Masukkan ke H3 event context TanStack Start.
          //    Di dalam route handler (server.handlers), AsyncLocalStorage
          //    aktif sehingga cookie tercatat di event.res.headers dan
          //    runtime Vercel mengirimnya sebagai header Set-Cookie terpisah.
          try {
            setCookie(name, value, cookieOpts)
          } catch {
            // Abaikan jika dipanggil di luar H3 event context (misalnya unit test)
          }

          // 2. Tulis juga ke responseHeaders sebagai fallback eksplisit.
          responseHeaders.append(
            'Set-Cookie',
            serializeCookie(name, value, cookieOpts),
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
