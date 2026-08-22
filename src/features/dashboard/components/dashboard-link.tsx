import { Heading } from '@/components'
import { Button } from '@/components/ui/button'
import type { LinkProps } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'

type DashboardLinkProps = {
  label: string
  url: LinkProps['to']
}

export const DashboardLink = ({ label, url }: DashboardLinkProps) => {
  return (
    <Button asChild variant={'default'}>
      <Link
        preload={false}
        to={url}
        className="capitalize w-full p-2 h-70 flex items-center justify-center"
      >
        <Heading size={'h3'} className="flex items-center gap-x-2">
          {label}
        </Heading>
      </Link>
    </Button>
  )
}
