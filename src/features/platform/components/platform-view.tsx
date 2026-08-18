import { Icon } from '@/components'
import { ConfirmDialog } from '@/components/actions'
import { CopyButton } from '@/components/fragments'
import { Heading } from '@/components/heading'
import { Button } from '@/components/ui/button'
import { env } from '@/configs/env'
import * as m from '@/generated/paraglide/messages'
import { useAuth } from '@/hooks'
import { useTRPC } from '@/lib/trpc/react'
import { cn } from '@/lib/utils'
import type { PlatformResponse } from '@/server/features/platform'
import { capitalizeWords } from '@/utils'
import { useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useDeletePlatform } from '../hooks/use-delete-platform'

const BASE_URL = env.VITE_BASE_URL

const getSlugSuffix = (slug: string) => {
  const suffix = slug.includes('-')
    ? slug.substring(slug.lastIndexOf('-') + 1)
    : slug

  return suffix
}

type PlatformViewProps = {
  platform: PlatformResponse
}

export const PlatformView = ({
  platform: { id, title, slug, url, password },
}: PlatformViewProps) => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { user } = useAuth()

  const publicUrl = password
    ? `${BASE_URL}/${user?.username}/p/${getSlugSuffix(slug)}?password=${password}`
    : `${BASE_URL}/${user?.username}/p/${getSlugSuffix(slug)}`

  const { onDelete, isPending } = useDeletePlatform({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: trpc.platform.getAll.queryKey(),
      })
    },
  })

  const handleDelete = () => onDelete({ id })

  return (
    <div className="flex w-full flex-col gap-5">
      <div className={cn('grid grid-cols-1 gap-x-5 gap-y-2 lg:grid-cols-3')}>
        <div className="flex items-center gap-x-5">
          <CopyButton
            label={`Copy Public URL ${capitalizeWords(title)}`}
            copyText={publicUrl}
            size="lg"
          />

          <Button variant={'neutral'} size={'lg'} asChild>
            <a
              href={url}
              className="block w-full flex-1 text-wrap"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="Eye" />
              Visit
            </a>
          </Button>
        </div>
        <Link
          to={`/{-$locale}/dashboard/platform/$id/edit`}
          params={{ id }}
          className="w-full"
        >
          <Button className="w-full" size={'lg'}>
            <Icon name="SquarePen" />
            Edit
          </Button>
        </Link>
        <>
          <Button
            variant={'destructive'}
            size={'lg'}
            disabled={isPending}
            className="w-full"
            onClick={() => setIsOpen(true)}
          >
            <Icon name="Trash2" />
            Delete
          </Button>
          <ConfirmDialog
            variant="delete"
            model={m.model_platform_title()}
            open={isOpen}
            onOpenChange={setIsOpen}
            onConfirm={handleDelete}
            isPending={isPending}
          />
        </>
      </div>

      <div className="mt-10 flex w-full flex-col items-center justify-center">
        <header className="flex w-full items-center justify-between">
          <Heading size={'h4'}>URL&apos;s List</Heading>
        </header>

        <main className="mt-10 w-full">URL LIST</main>
      </div>
    </div>
  )
}
