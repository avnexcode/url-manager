import { ImageThumbnail } from '@/components'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Link } from '@tanstack/react-router'
import type { PublicIdentifierResponse } from '../types'

type PublicIdentifierCardProps = {
  identifier: PublicIdentifierResponse
  className?: string
}

export const PublicIdentifierCard = ({
  identifier: {
    slug,
    title,
    thumbnail,
    user: { username },
  },
  className,
}: PublicIdentifierCardProps) => {
  return (
    <Link
      preload={false}
      to={`/{-$locale}/$username/identifier/$slug`}
      params={{ username, slug }}
      className={cn('block w-full', className)}
    >
      <Card className="relative w-full bg-secondary-background py-2 transition-colors hover:bg-secondary-background/80">
        <CardContent className="flex w-[90%] items-center gap-3 truncate text-lg font-semibold capitalize md:w-full">
          <ImageThumbnail thumbnail={thumbnail} title={title} />
          <div className="flex min-w-0 flex-col">
            <span className="truncate">{title}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
