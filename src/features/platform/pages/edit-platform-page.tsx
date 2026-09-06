import { Heading } from '@/components'
import { MainLayout } from '@/components/layouts'
import * as m from '@/generated/paraglide/messages'
import { useTRPC } from '@/lib/trpc/react'
import { Route } from '@/routes/{-$locale}/_authenticated/dashboard/platform/$id/edit'
import { useQuery } from '@tanstack/react-query'
import { EditPlatformForm } from '../forms'
import { useUpdatePlatform } from '../hooks'
import { EditPlatformFormSkeleton } from '../skeletons'

export const EditPlatformPage = () => {
  const { id } = Route.useParams()

  const trpc = useTRPC()

  const { data: platform, isLoading: isPlatformLoading } = useQuery(
    trpc.platform.getById.queryOptions({ id }),
  )

  const { form, onSubmit, hasChanges, isPending } = useUpdatePlatform(
    id,
    platform,
  )

  return (
    <MainLayout
      headerContent={<Heading size={'h2'}>{m.page_platform_title()}</Heading>}
    >
      {isPlatformLoading ? (
        <EditPlatformFormSkeleton />
      ) : (
        platform && (
          <EditPlatformForm
            form={form}
            onSubmit={onSubmit}
            hasChanges={hasChanges}
            isPending={isPending}
            thumbnail={platform.thumbnail}
            platformId={platform.id}
          />
        )
      )}
    </MainLayout>
  )
}
