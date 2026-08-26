import { ImageThumbnail, ImageThumbnailSkeleton } from '@/components'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { PublicUrlResponse } from '../types'

type PublicUrlCardProps = {
  url: PublicUrlResponse
  className?: string
}

export const PublicUrlCard = ({
  url: { title, url: destinationUrl, thumbnail },
  className,
}: PublicUrlCardProps) => {
  return (
    <a
      href={destinationUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn('block w-full', className)}
    >
      <Card className="relative w-full bg-secondary-background py-2 transition-colors hover:bg-secondary-background/80">
        <CardContent className="flex w-[90%] items-center gap-3 truncate text-lg font-semibold capitalize md:w-full">
          <ImageThumbnail thumbnail={thumbnail} title={title} />
          <div className="flex min-w-0 items-center gap-1">
            <span className="truncate">{title}</span>
          </div>
        </CardContent>
      </Card>
    </a>
  )
}

export const PublicUrlCardSkeleton = () => {
  return (
    <div className="flex w-full flex-row items-center justify-center gap-3 sm:gap-5">
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
  )
}
