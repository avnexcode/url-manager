import { createSSRClient } from '@/lib/supabase/server'
import { prisma as db } from '@/server/db'
import { AuthService } from '@/server/features/auth'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/oauth/callback')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const code = url.searchParams.get('code') ?? undefined
        const next = url.searchParams.get('next') ?? undefined

        const responseHeaders = new Headers()
        const errorLoginRedirect = '/login?error=auth_failed'

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

        try {
          await AuthService.registerOAuth(db, data.user)
        } catch {
          responseHeaders.set(
            'Location',
            new URL(errorLoginRedirect, url.origin).toString(),
          )
          return new Response(null, { status: 302, headers: responseHeaders })
        }

        responseHeaders.set(
          'Location',
          new URL(next ?? '/dashboard', url.origin).toString(),
        )
        return new Response(null, { status: 302, headers: responseHeaders })
      },
    },
  },
})
