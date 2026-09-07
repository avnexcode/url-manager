import { Skeleton } from '../ui/skeleton'

export const InputTextSkeleton = () => {
  return (
    <div className="space-y-3">
      <Skeleton className="h-5 w-44" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

export const InputTextAreaSkeleton = () => {
  return (
    <div className="space-y-3">
      <Skeleton className="h-5 w-44" />
      <Skeleton className="h-30 w-full" />
    </div>
  )
}
