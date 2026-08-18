// import type { AuthContextProps } from '@/contexts'
// import { AuthContext } from '@/contexts'
// import { useLoaderData, useRouteContext } from '@tanstack/react-router'

// export const AuthProvider: React.FC<React.PropsWithChildren> = ({
//   children,
// }) => {
//   const { user } = useRouteContext({ from: '__root__' })

//   const { account, setting } = useLoaderData({ from: '__root__' })

//   const isAuthenticated = !!user

//   const context: AuthContextProps = {
//     isAuthenticated,
//     user: account,
//     setting,
//   }

//   return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
// }

import type { AuthContextProps } from '@/contexts'
import { AuthContext } from '@/contexts'
import { useTRPC } from '@/lib/trpc/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useRouteContext } from '@tanstack/react-router'

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { user } = useRouteContext({ from: '__root__' })

  const trpc = useTRPC()

  const isAuthenticated = !!user

  const { data: account } = useSuspenseQuery({
    ...trpc.auth.getAccount.queryOptions(),
  })

  const { data: setting } = useSuspenseQuery({
    ...trpc.setting.getByUser.queryOptions(),
  })

  const context: AuthContextProps = {
    isAuthenticated,
    user: account,
    setting,
  }

  return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
}
