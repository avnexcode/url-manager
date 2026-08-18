import * as React from 'react'

import { Icon } from '@/components/icon'
import { Separator } from '@/components/ui/separator'
import { env } from '@/configs/env'
import { useLogout } from '@/features/auth/hooks'
import { useAuth } from '@/hooks'
import { renderElements } from '@/utils'
import { Link } from '@tanstack/react-router'
import { Button } from '../../ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../ui/sheet'
import { routeList } from './menu'

export const MobileNavbar = () => {
  const { user, isAuthenticated } = useAuth()
  const { handleLogout } = useLogout()
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="flex items-center gap-2 lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button
            aria-label="Open menu"
            className="flex size-10 cursor-pointer items-center justify-center border-2 border-border bg-secondary-background shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            <Icon name="Menu" className="size-5" />
          </button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="flex flex-col border-r-2 border-border p-0"
        >
          {/* Header panel */}
          <SheetHeader className="border-b-2 border-border p-4">
            <SheetTitle className="flex items-center justify-between">
              <Link
                to="/{-$locale}"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center border-2 border-border bg-main px-3 py-1 font-black uppercase tracking-tight text-main-foreground shadow-shadow"
              >
                {env.VITE_APP_TITLE}
              </Link>
            </SheetTitle>
            <SheetDescription className="hidden" />
          </SheetHeader>

          {/* Nav links */}
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-3">
            {isAuthenticated &&
              renderElements({
                of: routeList,
                keyExtractor: (route) => route.label,
                render: (route) => (
                  <Button
                    asChild
                    key={route.href}
                    variant={'secondary'}
                    onClick={() => setIsOpen(false)}
                    className="h-11 justify-start gap-3 rounded-none border-2 border-transparent px-3 text-base hover:border-border"
                  >
                    <Link to={route.href}>
                      <Icon name={route.icon} className="size-4" />
                      {route.label}
                    </Link>
                  </Button>
                ),
              })}
          </div>

          {/* Footer: user info + auth action */}
          <SheetFooter className="flex-col border-t-2 border-border p-4 gap-3">
            {isAuthenticated && user ? (
              <>
                <div className="flex flex-col gap-1 border-2 border-border bg-secondary-background p-1">
                  <div className="flex items-center gap-2 text-sm font-base">
                    <Icon name="User" className="size-4" />
                    <span className="truncate">{user.username}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 border-2 border-border bg-secondary-background p-1">
                  <div className="flex items-center gap-2 text-sm font-base">
                    <Icon name="Mail" className="size-4" />
                    <span className="truncate">{user.email}</span>
                  </div>
                </div>
              </>
            ) : null}

            <Separator className="border-t-2 border-border h-0" />

            {!isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <Button
                  asChild
                  variant="neutral"
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                >
                  <Link to="/{-$locale}/login">Login</Link>
                </Button>
                <Button
                  asChild
                  variant="default"
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                >
                  <Link to="/{-$locale}/register">Register</Link>
                </Button>
              </div>
            ) : (
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="w-full justify-start gap-3"
              >
                <Icon name="LogOut" className="size-4" />
                Logout
              </Button>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
