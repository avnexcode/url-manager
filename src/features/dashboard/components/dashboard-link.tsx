import { Heading, Icon } from '@/components'
import { Button } from '@/components/ui/button'
import type { LinkProps } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import type { icons } from 'lucide-react'

type DashboardLinkProps = {
  label: string
  url: LinkProps['to']
  icon: keyof typeof icons
}

export const DashboardLink = ({ label, url, icon }: DashboardLinkProps) => {
  return (
    <Button asChild variant={'default'}>
      <Link
        to={url}
        className="capitalize w-full p-2 h-70 flex items-center justify-center"
      >
        <Heading size={'h3'} className="flex items-center gap-x-2">
          <Icon name={icon} />
          {label}
        </Heading>
      </Link>
    </Button>
  )
}
