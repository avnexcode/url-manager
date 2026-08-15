import { cn } from '@/lib/utils'
import { Heading } from '../heading'
import { GridPattern } from '../ui/grid-pattern'
import { Separator } from '../ui/separator'

type MainLayoutProps = {
  title: string
  className?: string
}

export const MainLayout: React.FC<
  React.PropsWithChildren & MainLayoutProps
> = ({ children, title, className }) => {
  return (
    <div>
      <header className="space-y-2 py-3">
        <Heading size={'h3'}>{title}</Heading>
        <Separator className="bg-foreground pt-0.5" />
      </header>
      <main className={cn('relative h-full', className)}>
        {children}
        <GridPattern />
      </main>
    </div>
  )
}
