import { createSSRClient } from '@/lib/supabase/server'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/callback')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const code = url.searchParams.get('code') ?? undefined
        const next = url.searchParams.get('next') ?? '/login'

        const responseHeaders = new Headers()
        const errorLoginRedirect = '/login?error=verification_failed'

        if (!code) {
          return Response.redirect(new URL('/login', url.origin))
        }

        const supabase = createSSRClient({ request, responseHeaders })

        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
          responseHeaders.set(
            'Location',
            new URL(errorLoginRedirect, url.origin).toString(),
          )
          return new Response(null, { status: 302, headers: responseHeaders })
        }

        const email = data.user.email ?? ''
        const redirectUrl = new URL(next, url.origin)

        redirectUrl.searchParams.set('verified', 'true')
        redirectUrl.searchParams.set('email', email)

        responseHeaders.set('Location', redirectUrl.toString())

        return new Response(null, { status: 302, headers: responseHeaders })
      },
    },
  },
})
