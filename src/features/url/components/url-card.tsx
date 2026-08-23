import { ImageThumbnail, ImageThumbnailSkeleton } from '@/components'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Link } from '@tanstack/react-router'
import type { UrlResponse } from '../types'

type UrlCardProps = {
  url: UrlResponse
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  className?: string
  isPending: boolean
}

export const UrlCard = ({
  url: { id, title, thumbnail },
  checked,
  onCheckedChange,
  className,
  isPending,
}: UrlCardProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-2 sm:flex-row',
        isPending && 'opacity-50',
        className,
      )}
    >
      <div className="flex w-full flex-row items-center justify-center gap-3 sm:gap-5">
        <Checkbox
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={isPending}
        />
        <Link
          preload={false}
          to={`/{-$locale}/dashboard/url/$id/view`}
          params={{ id }}
          className={cn(
            'block w-full',
            isPending && 'pointer-events-none cursor-not-allowed',
          )}
          aria-disabled={isPending}
          tabIndex={isPending ? -1 : undefined}
          onClick={(e) => {
            if (isPending) e.preventDefault()
          }}
        >
          <Card className="relative w-full bg-secondary-background py-2">
            <CardContent className="flex w-72 items-center gap-3 truncate text-lg font-semibold capitalize sm:w-96 md:w-full">
              <ImageThumbnail thumbnail={thumbnail} title={title} />
              <div className="flex min-w-0 items-center gap-1">
                <span className="truncate">{title}</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

export const UrlCardSkeleton = () => {
  return (
    <div className="flex flex-col items-center gap-2 sm:flex-row">
      <div className="flex w-full flex-row items-center justify-center gap-3 sm:gap-5">
        <Skeleton className="size-5 shrink-0" />
        <div className="block w-full">
          <Card className="relative w-full bg-secondary-background py-2">
            <CardContent className="flex w-72 items-center gap-3 sm:w-96 md:w-full">
              <ImageThumbnailSkeleton />
              <div className="flex min-w-0 flex-1 items-center">
                <Skeleton className="h-5 w-36 sm:w-60" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
