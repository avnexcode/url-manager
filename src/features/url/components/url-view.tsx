import {
  Icon,
  ImagePreview,
  ImagePreviewSkeleton,
  QrImageDialog,
} from '@/components'
import { ActionButton, ActionLink, ExternalLink } from '@/components/elements'
import { ConfirmDialog } from '@/components/fragments'
import { Heading } from '@/components/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import * as m from '@/generated/paraglide/messages'
import { useTRPC } from '@/lib/trpc/react'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useDeleteUrl } from '../hooks'
import type { UrlResponse } from '../types'

type UrlViewProps = {
  url: UrlResponse
}

export const UrlView = ({
  url: { id, title, description, url, thumbnail, qrEncodedValue, qrCodeUrl },
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
                size="sm"
                to="/{-$locale}/dashboard/url/$id/edit"
                hideLabel
              />
              <ActionButton
                action="delete"
                size="sm"
                isPending={isPending}
                onClick={() => setIsOpen(true)}
                hideLabel
              />
            </div>
          </div>
        </div>

        {/* Secondary action */}
        <div className="px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-2 sm:flex-row justify-end">
            {qrCodeUrl && (
              <Button
                type="button"
                variant="neutral"
                size="sm"
                onClick={() => setIsQrOpen(true)}
                className="w-full gap-2 sm:w-auto"
              >
                <Icon name="QrCode" className="size-4" />
                {m.component_view_show_qr()}
              </Button>
            )}
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
            {/* Heading */}
            <Skeleton className="h-7 w-48 max-w-full" />

            {/* Empty badge row — UrlView renders no badges, kept as spacer to match layout */}
            <div className="flex flex-wrap items-center gap-2" />

            {/* Destination URL text */}
            <Skeleton className="h-4 w-56 max-w-full" />

            {/* Description (separator + 2 lines) */}
            <Skeleton className="h-px w-full" />
            <Skeleton className="h-4 w-full max-w-md" />
            <Skeleton className="h-4 w-3/4 max-w-sm" />
          </div>

          {/* Edit + Delete action buttons */}
          <div className="flex shrink-0 items-center gap-2 self-end">
            <Skeleton className="size-9 shrink-0" />
            <Skeleton className="size-9 shrink-0" />
          </div>
        </div>
      </div>

      {/* Secondary action: QR + Visit buttons */}
      <div className="px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Skeleton className="h-9 w-full sm:w-28" />
          <Skeleton className="h-9 w-full sm:w-24" />
        </div>
      </div>
    </div>
  )
}
