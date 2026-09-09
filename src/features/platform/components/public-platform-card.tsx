import { ImageThumbnail } from '@/components'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Link } from '@tanstack/react-router'
import type { PublicPlatformResponse } from '../types'

const CARD_WIDTH = 'w-90 sm:w-120 md:w-150 lg:w-200 xl:w-250 2xl:w-full'

type PublicPlatformCardProps = {
  platform: PublicPlatformResponse
  className?: string
}

export const PublicPlatformCard = ({
  platform: {
    slug,
    title,
    thumbnail,
    user: { username },
  },
  className,
}: PublicPlatformCardProps) => {
  return (
    <Link
      preload={false}
      to={`/{-$locale}/$username/platform/$slug`}
      params={{ username, slug }}
      className={cn('block w-full', className)}
    >
      <Card className="relative w-full bg-secondary-background py-2 transition-colors hover:bg-secondary-background/80">
        <CardContent
          className={cn(
            CARD_WIDTH,
            'flex items-center gap-3 truncate text-lg font-semibold capitalize',
          )}
        >
          <ImageThumbnail thumbnail={thumbnail} title={title} />
          <div className="flex min-w-0 flex-col">
            <span className="truncate">{title}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
