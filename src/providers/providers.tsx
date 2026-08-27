import { AuthProvider } from './auth-provider'
import { LocaleSync } from './locale-sync'
import { ThemeProvider } from './theme-provider'

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <AuthProvider>
      <ThemeProvider>
        {/* Sinkronisasi locale dari DB ke Paraglide secara global */}
        <LocaleSync />
        {children}
      </ThemeProvider>
    </AuthProvider>
  )
}
