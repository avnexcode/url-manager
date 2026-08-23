import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Icon } from './icon'

const PREVIEW_SIZE = 'h-40 w-40'

type ImagePreviewProps = {
  thumbnail?: string | null
  title: string
  className?: string
}

export const ImagePreview = ({
  thumbnail,
  title,
  className,
}: ImagePreviewProps) => {
  return (
    <Avatar
      className={cn(
        PREVIEW_SIZE,
        'shrink-0 self-center rounded-none shadow-md sm:self-start',
        className,
      )}
    >
      <AvatarImage
        src={thumbnail ?? ''}
        alt={title}
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
        className="object-cover"
      />
      <AvatarFallback className="bg-primary/20 text-primary rounded-none">
        <Icon name="ImageOff" className="h-20 w-20" />
      </AvatarFallback>
    </Avatar>
  )
}

type ImagePreviewSkeletonProps = {
  className?: string
}

export const ImagePreviewSkeleton = ({
  className,
}: ImagePreviewSkeletonProps) => {
  return (
    <Skeleton
      className={cn(
        PREVIEW_SIZE,
        'shrink-0 self-center rounded-none shadow-md sm:self-start',
        className,
      )}
    />
  )
}
