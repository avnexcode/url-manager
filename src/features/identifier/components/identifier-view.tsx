import {
  Icon,
  ImagePreview,
  ImagePreviewSkeleton,
  QrImageDialog,
} from '@/components'
import {
  ActionButton,
  ActionLink,
  CopyTextWrapper,
} from '@/components/elements'
import { ConfirmDialog } from '@/components/fragments'
import { Heading } from '@/components/heading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import * as m from '@/generated/paraglide/messages'
import { getVisibility } from '@/lib/get-enum-label'
import { useTRPC } from '@/lib/trpc/react'
import { cn } from '@/lib/utils'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useDeleteIdentifier } from '../hooks'
import type { IdentifierResponse } from '../types'

type IdentifierViewProps = {
  identifier: IdentifierResponse
}

export const IdentifierView = ({
  identifier: {
    id,
    title,
    description,
    visibility,
    password,
    thumbnail,
    qrCodeUrl,
    qrEncodedValue,
  },
}: IdentifierViewProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isQrOpen, setIsQrOpen] = useState<boolean>(false)

  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const { onDelete, isPending } = useDeleteIdentifier({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.identifier.getAll.queryKey(),
      })
    },
  })

  const handleDelete = () => onDelete({ id })

  const isPrivate = visibility === 'PRIVATE'
  const isLocked = Boolean(password)

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

              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-none border-2 px-2.5 py-0.5 text-xs font-semibold',
                    isLocked
                      ? 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400'
                      : 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400',
                  )}
                >
                  {isLocked ? (
                    <Icon name="LockKeyhole" size={11} className="shrink-0" />
                  ) : (
                    <Icon name="LockOpen" size={11} className="shrink-0" />
                  )}
                  {isLocked
                    ? m.component_view_lock_status_locked()
                    : m.component_view_lock_status_open()}
                </span>

                <Badge
                  className={cn(
                    'rounded-none font-semibold tracking-widest uppercase text-white',
                    isPrivate
                      ? 'bg-red-500 dark:bg-red-600'
                      : 'bg-blue-500 dark:bg-blue-400',
                  )}
                >
                  {getVisibility({ visibility })}
                </Badge>
              </div>
              {password ? (
                <div className="flex items-center gap-x-1 text-sm py-2">
                  <h1 className="capitalize">
                    {m.model_identifier_field_password()}:
                  </h1>
                  <CopyTextWrapper>{password}</CopyTextWrapper>
                </div>
              ) : null}
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
                to="/{-$locale}/dashboard/identifier/$id/edit"
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
          </div>
        </div>

        <Separator className="my-5" />
      </div>

      <ConfirmDialog
        variant="delete"
        model={m.model_identifier_title()}
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

export const IdentifierViewSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-0">
      <div className="from-primary/10 via-primary/5 bg-linear-to-br to-transparent">
        <div className="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-start sm:gap-6 sm:px-6 sm:py-7">
          <ImagePreviewSkeleton />

          <div className="flex min-w-0 flex-1 flex-col gap-2">
            {/* Heading */}
            <Skeleton className="h-7 w-48 max-w-full" />

            {/* Lock status + visibility badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-5.5 w-20 rounded-none" />
              <Skeleton className="h-5.5 w-16 rounded-none" />
            </div>

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

      {/* QR button (only shown when qrCodeUrl exists) */}
      <div className="px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Skeleton className="h-9 w-full sm:w-28" />
        </div>
      </div>

      {/* URL list section */}
      <div className="px-4 py-5 sm:px-6">
        <header className="mb-4 flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
        </header>

        <main className="w-full">
          <div className="flex min-h-32 w-full flex-col items-center justify-center gap-3 rounded-none border-2 border-dashed border-border py-10">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-9 w-32" />
          </div>
        </main>
      </div>
    </div>
  )
}
