import { cn } from '#/lib/utils.ts'

export const Skeleton = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="skeleton"
      className={cn('animate-pulse rounded-md bg-accent', className)}
      {...props}
    />
  )
}
