import { cn } from '@/lib/utils'

export const Skeleton = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'animate-pulse rounded-base bg-secondary-background border-2 border-border',
        className,
      )}
      {...props}
    />
  )
}
