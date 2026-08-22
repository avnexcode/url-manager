import { Icon } from '@/components'
import { ActionButton, ActionLink, CopyButton } from '@/components/elements'
import { ConfirmDialog } from '@/components/fragments'
import { Heading } from '@/components/heading'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { env } from '@/configs/env'
import * as m from '@/generated/paraglide/messages'
import { useAuth } from '@/hooks'
import { getVisibility } from '@/lib/get-enum-label'
import { useTRPC } from '@/lib/trpc/react'
import { cn } from '@/lib/utils'
import { capitalizeWords } from '@/utils'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useDeleteIdentifier } from '../hooks'
import type { IdentifierResponse } from '../types'

const BASE_URL = env.VITE_BASE_URL

const getSlugSuffix = (slug: string) => {
  const suffix = slug.includes('-')
    ? slug.substring(slug.lastIndexOf('-') + 1)
    : slug

  return suffix
}

type IdentifierViewProps = {
  identifier: IdentifierResponse
}

export const IdentifierView = ({
  identifier: { id, title, slug, visibility, password, thumbnail },
}: IdentifierViewProps) => {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const publicUrl = password
    ? `${BASE_URL}/${user.username}/i/${getSlugSuffix(slug)}?password=${password}`
    : `${BASE_URL}/${user.username}/i/${getSlugSuffix(slug)}`

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
            <Avatar className="h-40 w-40 shrink-0 self-center rounded-none shadow-md sm:self-start">
              <AvatarImage
                src={thumbnail ?? ''}
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                className="object-cover"
              />
              <AvatarFallback className="bg-primary/20 text-primary rounded-none">
                <Icon name="ImageOff" className="h-20 w-20" />
              </AvatarFallback>
            </Avatar>

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

        <Separator />

        <div className="px-4 py-4 sm:px-6">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {m.component_view_public_url_label()}
          </p>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-none border-2 border-border bg-secondary-background px-3 py-2">
              <Icon
                name="Link"
                className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
              />
              <span
                className="min-w-0 flex-1 truncate font-mono text-xs text-foreground"
                title={publicUrl}
              >
                {publicUrl}
              </span>
              <CopyButton
                label={`Copy Public URL ${capitalizeWords(title)}`}
                copyText={publicUrl}
                size="icon"
                className="h-6 w-6 shrink-0"
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="px-4 py-5 sm:px-6">
          <header className="mb-4 flex items-center justify-between">
            <Heading size="h4" as="h2">
              {m.component_view_url_list_heading()}
            </Heading>
          </header>

          <main className="w-full">
            <div className="flex min-h-32 flex-col items-center justify-center gap-2 rounded-none border-2 border-dashed border-border bg-secondary-background py-10 text-center">
              <Icon name="Link" className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                {m.component_view_url_list_empty()}
              </p>
            </div>
          </main>
        </div>
      </div>

      <ConfirmDialog
        variant="delete"
        model={m.model_identifier_title()}
        open={isOpen}
        onOpenChange={setIsOpen}
        onConfirm={handleDelete}
        isPending={isPending}
      />
    </>
  )
}
