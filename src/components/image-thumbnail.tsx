import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { ImageOff } from 'lucide-react'
import { Skeleton } from './ui/skeleton'

const THUMBNAIL_SIZE = 'size-14'

type ImageThumbnailProps = {
  thumbnail?: string | null
  title: string
}

export const ImageThumbnail = ({ thumbnail, title }: ImageThumbnailProps) => {
  return (
    <Avatar
      className={cn(THUMBNAIL_SIZE, 'shrink-0 rounded-none -outline-offset-2')}
    >
      <AvatarImage
        src={thumbnail ?? ''}
        alt={title}
        loading="lazy"
        className="size-full object-cover"
      />
      <AvatarFallback className="rounded-none bg-muted">
        <ImageOff size={18} className="text-muted-foreground" />
      </AvatarFallback>
    </Avatar>
  )
}

export const ImageThumbnailSkeleton = () => {
  return <Skeleton className={cn(THUMBNAIL_SIZE, 'shrink-0 border-2')} />
}
