import { AuthProvider } from './auth-provider'

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>
}
