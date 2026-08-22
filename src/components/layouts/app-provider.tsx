import { getLocale } from '@/generated/paraglide/runtime'
import { HeadContent, Scripts } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import { Toaster } from '../ui/sonner'

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

const AppDevtools = import.meta.env.DEV
  ? lazy(() =>
      import('./app-devtools').then((m) => ({ default: m.AppDevtools })),
    )
  : null

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang={getLocale()} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased wrap-anywhere selection:bg-[rgba(79,184,178,0.24)]">
        {children}
        <Toaster position="top-center" />
        {AppDevtools && (
          <Suspense>
            <AppDevtools />
          </Suspense>
        )}
        <Scripts />
      </body>
    </html>
  )
}
