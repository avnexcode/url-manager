import * as m from '@/generated/paraglide/messages'
import type { LinkProps } from '@tanstack/react-router'
import type { icons } from 'lucide-react'

export type RouteProps = {
  href: LinkProps['to']
  label: string
  icon: keyof typeof icons
}

export const routeList: RouteProps[] = [
  {
    href: '/{-$locale}/dashboard',
    label: m.component_navbar_item_dashboard(),
    icon: 'LayoutDashboard',
  },
  {
    href: '/{-$locale}/account',
    label: m.component_navbar_item_account(),
    icon: 'UserRoundCog',
  },
  {
    href: '/{-$locale}/setting',
    label: m.component_navbar_item_setting(),
    icon: 'Settings',
  },
]
