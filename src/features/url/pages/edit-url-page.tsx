import { Heading } from '@/components'
import { MainLayout } from '@/components/layouts'
import * as m from '@/generated/paraglide/messages'
import { useTRPC } from '@/lib/trpc/react'
import { Route } from '@/routes/{-$locale}/_authenticated/dashboard/url/$id/edit'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { EditUrlForm } from '../forms'
import { useUpdateUrl } from '../hooks'
import { EditUrlFormSkeleton } from '../skeletons'
import { getRedirectTo } from '../utils'

export const EditUrlPage = () => {
  const { id } = Route.useParams()

  const trpc = useTRPC()

  const { data: url, isLoading: isUrlLoading } = useQuery(
    trpc.url.getById.queryOptions({ id }),
  )

  const search = Route.useSearch()

  const redirectTo = useMemo(() => getRedirectTo(search), [search])

  const { form, onSubmit, hasChanges, isPending } = useUpdateUrl(id, url, {
    redirectTo,
  })

  return (
    <MainLayout
      headerContent={<Heading size={'h2'}>{m.page_url_title()}</Heading>}
    >
      {isUrlLoading ? (
        <EditUrlFormSkeleton />
      ) : (
        url && (
          <EditUrlForm
            form={form}
            onSubmit={onSubmit}
            hasChanges={hasChanges}
            isPending={isPending}
            thumbnail={url.thumbnail}
            urlId={id}
          />
        )
      )}
    </MainLayout>
  )
}
