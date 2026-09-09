import { ImageThumbnail, ImageThumbnailSkeleton } from '@/components'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { getVisibility } from '@/lib/get-enum-label'
import { cn } from '@/lib/utils'
import { Link } from '@tanstack/react-router'
import { LockKeyhole, LockOpen } from 'lucide-react'
import type { IdentifierResponse } from '../types'

const CARD_WIDTH = 'w-90 sm:w-120 md:w-150 lg:w-200 xl:w-250 2xl:w-full'

type IdentifierCardProps = {
  identifier: IdentifierResponse
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  className?: string
  isPending: boolean
}

export const IdentifierCard = ({
  identifier: { id, title, visibility, password, thumbnail },
  checked,
  onCheckedChange,
  className,
  isPending,
}: IdentifierCardProps) => {
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
          to={`/{-$locale}/dashboard/identifier/$id/view`}
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
            <CardContent
              className={cn(
                CARD_WIDTH,
                'flex items-center gap-3 truncate text-lg font-semibold capitalize',
              )}
            >
              <ImageThumbnail thumbnail={thumbnail} title={title} />
              <div className="flex min-w-0 items-center gap-1">
                {password ? (
                  <LockKeyhole
                    size={20}
                    className="shrink-0 text-red-500 dark:text-red-600"
                  />
                ) : (
                  <LockOpen
                    size={20}
                    className="shrink-0 text-green-500 dark:text-green-600"
                  />
                )}
                <span className="truncate">{title}</span>
              </div>
            </CardContent>

            <Badge
              variant="default"
              className={cn(
                'absolute top-0.5 right-2 scale-75 font-semibold tracking-[3px] text-white uppercase md:top-2 md:scale-85 xl:scale-100',
                visibility === 'PRIVATE'
                  ? 'bg-red-500'
                  : 'bg-blue-500 dark:bg-blue-400',
              )}
            >
              {getVisibility({ visibility })}
            </Badge>
          </Card>
        </Link>
      </div>
    </div>
  )
}

export const IdentifierCardSkeleton = () => {
  return (
    <div className="flex flex-col items-center gap-2 sm:flex-row">
      <div className="flex w-full flex-row items-center justify-center gap-3 sm:gap-5">
        <Skeleton className="size-5 shrink-0" />
        <div className="block w-full">
          <Card className="relative w-full bg-secondary-background py-2">
            <CardContent className="flex w-72 items-center gap-3 sm:w-96 md:w-full">
              <ImageThumbnailSkeleton />
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <Skeleton className="size-5 shrink-0" />
                <Skeleton className="h-5 w-36 sm:w-60" />
              </div>
            </CardContent>

            <Skeleton className="absolute top-0.5 right-2 h-4 w-16 scale-75 md:top-2 md:scale-85 xl:scale-100" />
          </Card>
        </div>
      </div>
    </div>
  )
}
