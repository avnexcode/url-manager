import { Icon } from '@/components/icon'
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
import { useAuth } from '@/hooks'
import { renderElements } from '@/utils'
import { Link } from '@tanstack/react-router'
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
          Login
        </Link>
        <Link
          to="/{-$locale}/register"
          className="inline-flex h-10 items-center gap-2 border-2 border-border bg-main px-4 text-sm font-base text-main-foreground shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
        >
          Register
        </Link>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="group relative flex cursor-pointer items-center gap-2 border-2 border-border bg-secondary-background p-1 pr-1 shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2">
          <Avatar className="size-8 rounded-none border-2 border-border">
            <AvatarImage
              src={user?.avatar ?? ''}
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            />
            <AvatarFallback className="rounded-none bg-main text-secondary-foreground font-heading text-sm">
              {user?.email.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <Icon name="ChevronDown" className="size-3 opacity-60" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="mt-1 w-56 rounded-none border-2 border-border shadow-shadow bg-secondary-background"
        align="end"
      >
        <DropdownMenuLabel className="border-b-2 border-border pb-2">
          <p className="font-heading truncate text-secondary-foreground">
            {user?.email}
          </p>
        </DropdownMenuLabel>

        <DropdownMenuGroup className="pt-1">
          {renderElements({
            of: routeList,
            keyExtractor: (route) => route.label,
            render: (route) => (
              <DropdownMenuItem
                key={route.label}
                asChild
                className="rounded-none cursor-pointer bg-secondary-background text-secondary-foreground"
              >
                <Link to={route.href} className="flex items-center gap-2">
                  <Icon name={route.icon} />
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
          <Icon name="LogOut" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
