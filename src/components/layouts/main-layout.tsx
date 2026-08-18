import { cn } from '@/lib/utils'
import { SegmentsNavigation } from '../elements'
import { Separator } from '../ui/separator'

type MainLayoutProps = {
  className?: string
  headerContent: React.ReactNode
  headerClassName?: string
}

export const MainLayout: React.FC<
  React.PropsWithChildren & MainLayoutProps
> = ({ children, className, headerContent, headerClassName }) => {
  return (
    <div className="space-y-5">
      <header
        className={cn(
          'flex w-full items-center justify-between h-15',
          headerClassName,
        )}
      >
        {headerContent}
      </header>
      <div className="space-y-2 pb-5">
        <Separator className="bg-foreground pt-0.5" />
        <SegmentsNavigation />
      </div>
      <main className={cn('relative h-full', className)}>{children}</main>
    </div>
  )
}
