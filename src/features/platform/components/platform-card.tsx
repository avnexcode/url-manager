import { Icon } from '@/components'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { getVisibility } from '@/lib/get-enum-label'
import { cn } from '@/lib/utils'
import type { PlatformResponse } from '@/server/features/platform'
import { Link } from '@tanstack/react-router'
import { LockKeyhole, LockOpen } from 'lucide-react'

type PlatformCardProps = {
  platform: PlatformResponse
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  className?: string
}

const THUMBNAIL_SIZE = 'size-14'

type PlatformThumbnailProps = {
  thumbnail: PlatformResponse['thumbnail']
  title: PlatformResponse['title']
}

const PlatformThumbnail = ({ thumbnail, title }: PlatformThumbnailProps) => {
  return (
    <div
      className={cn(
        THUMBNAIL_SIZE,
        'relative shrink-0 overflow-hidden bg-muted',
      )}
    >
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={title}
          loading="lazy"
          className="size-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      ) : (
        <div className="flex size-full items-center justify-center">
          <Icon name="ImageOff" size={18} className="text-muted-foreground" />
        </div>
      )}
    </div>
  )
}

export const PlatformCard = ({
  platform,
  checked,
  onCheckedChange,
  className,
}: PlatformCardProps) => {
  return (
    <div
      className={cn('flex flex-col items-center gap-2 sm:flex-row', className)}
    >
      <div className="flex w-full flex-row items-center justify-center gap-3 sm:gap-5">
        <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
        <Link
          to={`/{-$locale}/dashboard/platform/$id/view`}
          params={{ id: platform.id }}
          className="block w-full"
        >
          <Card className="relative w-full bg-secondary-background">
            <CardContent className="flex w-72 items-center gap-3 truncate text-lg font-semibold capitalize sm:w-96 md:w-full">
              <PlatformThumbnail
                thumbnail={platform.thumbnail}
                title={platform.title}
              />
              <div className="flex min-w-0 items-center gap-1">
                {platform.password ? (
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
                <span className="truncate">{platform.title}</span>
              </div>
            </CardContent>

            <Badge
              variant="default"
              className={cn(
                'absolute top-0.5 right-2 scale-75 font-semibold tracking-[3px] text-white uppercase md:top-2 md:scale-85 xl:scale-100',
                platform.visibility === 'PRIVATE'
                  ? 'bg-red-500'
                  : 'bg-blue-500 dark:bg-blue-400',
              )}
            >
              {getVisibility({ visibility: platform.visibility })}
            </Badge>
          </Card>
        </Link>
      </div>
    </div>
  )
}

export const PlatformCardSkeleton = () => {
  return (
    <div className="flex flex-col items-center gap-2 sm:flex-row">
      <div className="flex w-full flex-row items-center justify-center gap-3 sm:gap-5">
        <Skeleton className="size-5 shrink-0" />
        <div className="block w-full">
          <Card className="relative w-full bg-secondary-background">
            <CardContent className="flex w-72 items-center gap-3 sm:w-96 md:w-full">
              <Skeleton className={cn(THUMBNAIL_SIZE, 'shrink-0')} />
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
