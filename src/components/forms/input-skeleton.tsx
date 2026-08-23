import { Skeleton } from '../ui/skeleton'

export const InputTextSkeleton = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-5 w-44" />
      <Skeleton className="h-20 w-full" />
    </div>
  )
}

export const InputTextAreaSkeleton = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-5 w-44" />
      <Skeleton className="h-20 w-full" />
    </div>
  )
}
