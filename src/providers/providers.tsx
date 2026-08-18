import { AuthProvider } from './auth-provider'
import { ThemeProvider } from './theme-provider'

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <AuthProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </AuthProvider>
  )
}
