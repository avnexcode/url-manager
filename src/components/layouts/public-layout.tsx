import { cn } from '@/lib/utils'
import { Separator } from '../ui/separator'

type PublicLayoutProps = {
  className?: string
  headerContent: React.ReactNode
  headerClassName?: string
}

export const PublicLayout: React.FC<
  React.PropsWithChildren & PublicLayoutProps
> = ({ children, className, headerContent, headerClassName }) => {
  return (
    <div className="space-y-5 pb-5 mt-5">
      <header
        className={cn(
          'flex w-full items-center justify-between h-15',
          headerClassName,
        )}
      >
        {headerContent}
      </header>

      <div className="space-y-2">
        <Separator className="bg-foreground pt-0.5" />
      </div>

      <main className={cn('relative h-full mt-5 space-y-5', className)}>
        {children}
      </main>
    </div>
  )
}
