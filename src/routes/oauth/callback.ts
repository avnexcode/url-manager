import type { LoginProvider } from '@/generated/prisma/enums'
import { createSSRClientFromRequest } from '@/lib/supabase/server'
import { prisma as db } from '@/server/db'
import { AuthService } from '@/server/features/auth'
import { UserRepository, UserService } from '@/server/features/user'
import { createFileRoute } from '@tanstack/react-router'

type UserMetadata = {
  full_name: string
  name?: string
  avatar_url?: string
  picture?: string
}

type AppMetadata = {
  providers: LoginProvider[]
}

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

        const supabase = createSSRClientFromRequest(request, responseHeaders)

        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
          responseHeaders.set(
            'Location',
            new URL(errorLoginRedirect, url.origin).toString(),
          )
          return new Response(null, { status: 302, headers: responseHeaders })
        }

        const userMetadata = data.user.user_metadata as UserMetadata
        const appMetadata = data.user.app_metadata as AppMetadata
        const avatar = userMetadata.avatar_url ?? userMetadata.picture ?? ''

        try {
          await db.$transaction(async (tx) => {
            const currentUser = await UserRepository.findById(tx, data.user.id)

            if (!currentUser) {
              await AuthService.registerOAuth(
                tx,
                data.user.id,
                data.user.email!,
              )
              return
            }

            const { username, providers } = currentUser

            const isProviderExists = appMetadata.providers.every((p) =>
              providers.includes(p.toLocaleUpperCase() as LoginProvider),
            )

            const { error: updateAuthError } = await supabase.auth.updateUser({
              data: { username },
            })

            if (updateAuthError) throw updateAuthError

            if (!isProviderExists) {
              await UserService.update(tx, data.user.id, {
                avatar,
                provider: 'GOOGLE',
              })
            }
          })
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
