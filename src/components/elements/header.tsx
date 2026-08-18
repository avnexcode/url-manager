import { env } from '@/configs/env'
import { ParaglideLocaleSwitcher, ThemeToggle } from '@/components/actions'
import { Link } from '@tanstack/react-router'
import { DesktopNavbar, MobileNavbar } from '../fragments/navbar'
import { Heading } from '../heading'

export const Header = () => {
  return (
    <header className="container-nav">
      <div className="flex h-25 w-full items-center justify-between">
        {/* Logo */}
        <Heading size={'h5'} className="font-black tracking-tight uppercase">
          <Link to="/{-$locale}" className="flex items-center gap-2">
            <span className="inline-block border-2 border-foreground bg-main px-2 py-0.5 text-main-foreground shadow-shadow">
              {env.VITE_APP_TITLE}
            </span>
          </Link>
        </Heading>

        {/* Desktop: actions + navbar */}
        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <ParaglideLocaleSwitcher />
          <DesktopNavbar />
        </div>

        {/* Mobile: hamburger */}
        <MobileNavbar />
      </div>
    </header>
  )
}
