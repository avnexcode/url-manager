import { Heading } from '@/components'
import {
  MainLayout,
  PageContainer,
  SectionContainer,
} from '@/components/layouts'
import * as m from '@/generated/paraglide/messages'
import { useTRPC } from '@/lib/trpc/react'
import { Route } from '@/routes/{-$locale}/_authenticated/dashboard/identifier/$id/view'
import { useSuspenseQuery } from '@tanstack/react-query'
import { IdentifierView } from '../components'

export const DetailIdentifierPage = () => {
  const { id } = Route.useParams()
  const trpc = useTRPC()

  const { data: identifier } = useSuspenseQuery(
    trpc.identifier.getById.queryOptions({ id }),
  )

  return (
    <PageContainer withHeader withFooter>
      <SectionContainer container padded className="min-h-screen">
        <MainLayout
          headerContent={
            <Heading size={'h2'}>{m.page_identifier_title()}</Heading>
          }
        >
          <IdentifierView identifier={identifier} />
        </MainLayout>
      </SectionContainer>
    </PageContainer>
  )
}
