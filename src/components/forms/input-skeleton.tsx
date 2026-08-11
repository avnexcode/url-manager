import { Skeleton } from '../ui/skeleton'

export const InputSkeleton = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-5 w-44" />
      <Skeleton className="h-20 w-full" />
    </div>
  )
}
