import { paraglideMiddleware } from '@/generated/paraglide/server'
import { createMiddleware } from '@tanstack/react-start'

/**
 * TanStack Start **request-level** middleware for Paraglide i18n URL strategy.
 *
 * Must use type: 'request' — this intercepts the raw HTTP request before
 * TanStack Router processes it, allowing Paraglide to:
 *   1. Detect locale from URL  (/id/about → locale 'id')
 *   2. Store it in AsyncLocalStorage context
 *
 * We call next() without arguments — TanStack Router will handle URL
 * de-localization (/id/about → /about) via its own internal rewriting.
 * Passing the de-localized request here would cause a redirect loop.
 *
 * Register this via createStart({ requestMiddleware: [...] }) in src/start.ts.
 *
 * @see https://paraglidejs.com/middleware (section: TanStack Router)
 * @see src/generated/paraglide/server.js (JSDoc lines ~68-82)
 */
export const paraglideLocaleMiddleware = createMiddleware({ type: 'request' }).server(
  ({ request, next }) => {
    // paraglideMiddleware sets the locale in AsyncLocalStorage from the URL.
    // Call next() without arguments — do NOT pass the modified de-localized
    // request from paraglideMiddleware's callback, as TanStack Router handles
    // URL normalization itself to prevent infinite redirect loops.
    return paraglideMiddleware(
      request,
      () => next(),
      { effectiveRequestUrl: request.url }
    )
  }
)
