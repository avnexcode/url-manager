import { ImagePreview, ImagePreviewSkeleton, QrImageDialog } from '@/components'
import { ActionButton, ActionLink, ExternalLink } from '@/components/elements'
import { ConfirmDialog } from '@/components/fragments'
import { Heading } from '@/components/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import * as m from '@/generated/paraglide/messages'
import { useTRPC } from '@/lib/trpc/react'
import { cn } from '@/lib/utils'
import type { UrlSearchSchema } from '@/routes/{-$locale}/_authenticated/dashboard/url/create'
import { useQueryClient } from '@tanstack/react-query'
import { QrCode } from 'lucide-react'
import { useState } from 'react'
import { useDeleteUrl } from '../hooks'
import type { UrlResponse } from '../types'

type UrlViewProps = {
  url: UrlResponse
  searchParams?: UrlSearchSchema
}

export const UrlView = ({
  url: {
    id,
    title,
    description,
    url,
    thumbnail,
    qrEncodedValue,
    qrCodeUrl,
    platform,
    identifier,
  },
  searchParams,
}: UrlViewProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isQrOpen, setIsQrOpen] = useState<boolean>(false)

  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const { onDelete, isPending } = useDeleteUrl({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.url.getAll.queryKey(),
      })
    },
  })

  const handleDelete = () => onDelete({ id })

  return (
    <>
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

              <div className="flex flex-wrap items-center gap-2"></div>

              {description && (
                <>
                  <Separator />
                  <p className="text-sm text-muted-foreground line-clamp-2 py-1">
                    {description}
                  </p>
                </>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2 self-end">
              <ActionLink
                action="edit"
                to="/{-$locale}/dashboard/url/$id/edit"
                search={searchParams}
                hideLabel
              />
              <ActionButton
                action="delete"
                isPending={isPending}
                onClick={() => setIsOpen(true)}
                hideLabel
              />
            </div>
          </div>
        </div>

        <div className="px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-2 sm:flex-row justify-end">
            {qrCodeUrl && (
              <Button
                type="button"
                variant="neutral"
                onClick={() => setIsQrOpen(true)}
                className="w-full gap-2 sm:w-auto"
              >
                <QrCode className="size-4" />
                {m.component_view_show_qr()}
              </Button>
            )}
            <ExternalLink
              action="visit"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            />
          </div>
        </div>
        <Separator className="my-5" />
        <div className="grid grid-cols-1 gap-3 px-4 py-4 sm:grid-cols-2 sm:px-6">
          <div className="flex items-center gap-x-2.5 rounded-lg px-3 py-2.5">
            <div className="flex min-w-0 flex-col">
              <span className="text-xs text-muted-foreground capitalize">
                {m.model_platform_title()}
              </span>
              <span
                className={cn(
                  'truncate text-sm font-medium text-foreground',
                  !platform && 'font-normal italic text-muted-foreground',
                )}
              >
                {platform ? platform.title : '-'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-x-2.5 rounded-lg px-3 py-2.5">
            <div className="flex min-w-0 flex-col">
              <span className="text-xs text-muted-foreground capitalize">
                {m.model_identifier_title()}
              </span>
              <span
                className={cn(
                  'truncate text-sm font-medium text-foreground',
                  !identifier && 'font-normal italic text-muted-foreground',
                )}
              >
                {identifier ? identifier.title : '-'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        variant="delete"
        model={m.model_url_title()}
        open={isOpen}
        onOpenChange={setIsOpen}
        onConfirm={handleDelete}
        isPending={isPending}
      />

      <QrImageDialog
        open={isQrOpen}
        onOpenChange={setIsQrOpen}
        qrCodeUrl={qrCodeUrl}
        qrEncodedValue={qrEncodedValue}
      />
    </>
  )
}

export const UrlViewSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-0">
      <div className="from-primary/10 via-primary/5 bg-linear-to-br to-transparent">
        <div className="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-start sm:gap-6 sm:px-6 sm:py-7">
          <ImagePreviewSkeleton />

          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Skeleton className="h-7 w-48 max-w-full" />

            <div className="flex flex-wrap items-center gap-2" />

            <div className="flex flex-col gap-1.5 py-1">
              <Skeleton className="h-4 w-full max-w-md" />
              <Skeleton className="h-4 w-3/4 max-w-sm" />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 self-end">
            <ActionLink action="edit" hideLabel disabled />
            <ActionButton action="delete" hideLabel disabled />
          </div>
        </div>
      </div>

      <div className="px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row justify-end">
          <Button
            type="button"
            variant="neutral"
            disabled
            className="w-full gap-2 sm:w-auto opacity-50"
          >
            <QrCode className="size-4" />
            {m.component_view_show_qr()}
          </Button>

          <ExternalLink action="visit" href="#" disabled />
        </div>
      </div>

      <Separator className="my-5" />

      <div className="grid grid-cols-1 gap-3 px-4 py-4 sm:grid-cols-2 sm:px-6">
        <div className="flex items-center gap-x-2.5 rounded-lg px-3 py-2.5">
          <div className="flex min-w-0 flex-col gap-1">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        <div className="flex items-center gap-x-2.5 rounded-lg px-3 py-2.5">
          <div className="flex min-w-0 flex-col gap-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    </div>
  )
}
