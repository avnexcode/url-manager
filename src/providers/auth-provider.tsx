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

  const { data: account, isLoading: isAccountLoading } = useQuery({
    ...trpc.auth.getAccount.queryOptions(),
    enabled: isAuthenticated,
  })

  const { data: setting, isLoading: isSettingLoading } = useQuery({
    ...trpc.setting.getByUser.queryOptions(),
    enabled: isAuthenticated,
  })

  const context: AuthContextProps = {
    isAuthenticated,
    user: account,
    setting,
    isLoading: isAccountLoading || isSettingLoading,
  }

  return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
}
