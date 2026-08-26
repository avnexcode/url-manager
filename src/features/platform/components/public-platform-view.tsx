import { ImagePreview } from '@/components'
import { ExternalLink } from '@/components/elements'
import { Heading } from '@/components/heading'
import { Separator } from '@/components/ui/separator'
import type { PublicPlatformResponse } from '../types'

type PublicPlatformViewProps = {
  platform: PublicPlatformResponse
}

export const PublicPlatformView = ({
  platform: { title, description, url, thumbnail },
}: PublicPlatformViewProps) => {
  return (
    <div className="flex w-full flex-col gap-0">
      <div className="from-primary/10 via-primary/5 bg-linear-to-br to-transparent">
        <div className="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-start sm:gap-6 sm:px-6 sm:py-7">
          <ImagePreview thumbnail={thumbnail} title={title} />

          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Heading
              size="h3"
              className="truncate text-foreground capitalize leading-tight"
            >
              {title}
            </Heading>

            {description && (
              <>
                <Separator />
                <p className="text-sm text-muted-foreground line-clamp-2 py-1">
                  {description}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 py-4 sm:px-6">
        <div className="flex justify-end">
          <ExternalLink
            action="visit"
            size="sm"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          />
        </div>
      </div>

      <Separator className="my-5" />
    </div>
  )
}
