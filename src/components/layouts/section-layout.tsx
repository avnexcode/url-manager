import { cn } from '@/lib/utils'

type SectionLayoutProps = {
  className?: string
  headerContent: React.ReactNode
  headerClassName?: string
}

export const SectionLayout: React.FC<
  React.PropsWithChildren & SectionLayoutProps
> = ({ children, className, headerContent, headerClassName }) => {
  return (
    <div className="space-y-5 pb-5">
      <header
        className={cn(
          'flex w-full items-center justify-between h-15',
          headerClassName,
        )}
      >
        {headerContent}
      </header>

      <main className={cn('relative h-full space-y-5', className)}>
        {children}
      </main>
    </div>
  )
}
