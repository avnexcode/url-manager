import { Heading } from '@/components'
import {
  MainLayout,
  PageContainer,
  SectionContainer,
} from '@/components/layouts'
import * as m from '@/generated/paraglide/messages'
import { useTRPC } from '@/lib/trpc/react'
import { Route } from '@/routes/{-$locale}/_authenticated/dashboard/platform/$id/edit'
import { useSuspenseQuery } from '@tanstack/react-query'
import { EditPlatformForm } from '../forms'
import { useUpdatePlatform } from '../hooks/use-update-platform'

export const EditPlatformPage = () => {
  const { id } = Route.useParams()
  const trpc = useTRPC()

  const { data: platform } = useSuspenseQuery(
    trpc.platform.getById.queryOptions({ id }),
  )

  const { form, onSubmit, hasChanges, isPending } = useUpdatePlatform(platform)

  return (
    <PageContainer withHeader withFooter>
      <SectionContainer container padded className="min-h-screen">
        <MainLayout
          headerContent={
            <Heading size={'h2'}>{m.page_platform_title()}</Heading>
          }
        >
          <EditPlatformForm
            form={form}
            onSubmit={onSubmit}
            hasChanges={hasChanges}
            isPending={isPending}
            thumbnail={platform.thumbnail}
            platformId={platform.id}
          />
        </MainLayout>
      </SectionContainer>
    </PageContainer>
  )
}
