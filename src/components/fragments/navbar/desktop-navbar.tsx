import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLogout } from '@/features/auth/hooks'
import * as m from '@/generated//paraglide/messages'
import { useAuth } from '@/hooks'
import { renderElements } from '@/utils'
import { Link } from '@tanstack/react-router'
import { ChevronDown, LogOut } from 'lucide-react'
import { routeList } from './menu'

export const DesktopNavbar = () => {
  const { user, isAuthenticated } = useAuth()
  const { handleLogout } = useLogout()

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Link
          to="/{-$locale}/login"
          className="inline-flex h-10 items-center gap-2 border-2 border-border bg-secondary-background px-4 text-sm font-base text-foreground shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
        >
          {m.page_auth_login_title()}
        </Link>
        <Link
          to="/{-$locale}/register"
          className="inline-flex h-10 items-center gap-2 border-2 border-border bg-main px-4 text-sm font-base text-main-foreground shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
        >
          {m.page_auth_register_title()}
        </Link>
      </div>
    )
  }

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="group relative flex w-40 cursor-pointer items-center gap-2 border-2 border-border bg-secondary-background p-1 pr-1 shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2">
          <Avatar className="size-8 shrink-0 rounded-none">
            <AvatarImage
              src={user.image ?? user.avatar ?? ''}
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            />
            <AvatarFallback className="rounded-none bg-main text-secondary-foreground font-heading text-sm">
              {user.email.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <p className="min-w-0 flex-1 truncate font-heading text-secondary-foreground text-left">
            {user.username}
          </p>

          <ChevronDown className="size-3 shrink-0 opacity-60 mr-2" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="mt-1 w-56"
        variant={'neutral'}
        align="end"
      >
        <DropdownMenuLabel className="border-b-2 border-border pb-2">
          <p className="font-heading truncate text-secondary-foreground">
            {user.email}
          </p>
        </DropdownMenuLabel>

        <DropdownMenuGroup className="pt-1">
          {renderElements({
            of: routeList,
            keyExtractor: (route) => route.label,
            render: (route) => (
              <DropdownMenuItem
                key={route.label}
                variant={'neutral'}
                className="cursor-pointer"
                asChild
              >
                <Link
                  preload={false}
                  to={route.href}
                  className="flex items-center gap-2"
                >
                  <route.icon className="size-4" />
                  {route.label}
                </Link>
              </DropdownMenuItem>
            ),
          })}
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="border-t-2 border-border" />

        <DropdownMenuItem
          onClick={handleLogout}
          variant="destructive"
          className="rounded-none cursor-pointer bg-secondary-background"
        >
          <LogOut />
          {m.action_logout()}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
