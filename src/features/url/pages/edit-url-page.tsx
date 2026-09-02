import { Heading } from '@/components'
import { MainLayout } from '@/components/layouts'
import * as m from '@/generated/paraglide/messages'
import { useTRPC } from '@/lib/trpc/react'
import { Route } from '@/routes/{-$locale}/_authenticated/dashboard/url/$id/edit'
import { useSuspenseQuery } from '@tanstack/react-query'
import { EditUrlForm } from '../forms'
import { useUpdateUrl } from '../hooks'

export const EditUrlPage = () => {
  const { id } = Route.useParams()
  const trpc = useTRPC()

  const { data: url } = useSuspenseQuery(trpc.url.getById.queryOptions({ id }))

  const { form, onSubmit, hasChanges, isPending } = useUpdateUrl(url)

  return (
    <MainLayout
      headerContent={<Heading size={'h2'}>{m.page_url_title()}</Heading>}
    >
      <EditUrlForm
        form={form}
        onSubmit={onSubmit}
        hasChanges={hasChanges}
        isPending={isPending}
        thumbnail={url.thumbnail}
        urlId={url.id}
      />
    </MainLayout>
  )
}
