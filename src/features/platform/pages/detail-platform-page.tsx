import { Heading } from '@/components'
import {
  MainLayout,
  PageContainer,
  SectionContainer,
} from '@/components/layouts'
import * as m from '@/generated/paraglide/messages'
import { useTRPC } from '@/lib/trpc/react'
import { Route } from '@/routes/{-$locale}/_authenticated/dashboard/platform/$id/view'
import { useSuspenseQuery } from '@tanstack/react-query'
import { PlatformView } from '../components'

export const DetailPlatformPage = () => {
  const { id } = Route.useParams()
  const trpc = useTRPC()

  const { data: platform } = useSuspenseQuery(
    trpc.platform.getById.queryOptions({ id }),
  )

  return (
    <PageContainer withHeader withFooter>
      <SectionContainer container padded className="min-h-screen">
        <MainLayout
          headerContent={
            <Heading size={'h2'}>{m.page_platform_title()}</Heading>
          }
        >
          <PlatformView platform={platform} />
        </MainLayout>
      </SectionContainer>
    </PageContainer>
  )
}
