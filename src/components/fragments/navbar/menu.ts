import type { icons } from 'lucide-react'

export type RouteProps = {
  href: string
  label: string
  icon: keyof typeof icons
}

export const routeList: RouteProps[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
  },
  {
    href: '/account',
    label: 'Account',
    icon: 'UserRoundCog',
  },
  {
    href: '/setting',
    label: 'Setting',
    icon: 'Settings',
  },
]
