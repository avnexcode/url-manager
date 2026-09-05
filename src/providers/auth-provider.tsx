import type { AuthContextProps } from '@/contexts'
import { AuthContext } from '@/contexts'
import { useTRPC } from '@/lib/trpc/react'
import { useQuery } from '@tanstack/react-query'
import { useRouteContext } from '@tanstack/react-router'

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { user } = useRouteContext({ from: '__root__' })

  const trpc = useTRPC()

  const isAuthenticated = !!user

  // Fetch account and setting client-side only.
  // These are NOT prefetched on the server to avoid SSR HTTP loopback
  // requests on Vercel that lose session cookies and throw UNAUTHORIZED.
  const { data: account } = useQuery({
    ...trpc.auth.getAccount.queryOptions(),
    enabled: isAuthenticated,
  })

  const { data: setting } = useQuery({
    ...trpc.setting.getByUser.queryOptions(),
    enabled: isAuthenticated,
  })

  const context: AuthContextProps = {
    isAuthenticated,
    user: account,
    setting,
  }

  return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
}
