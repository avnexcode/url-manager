import { Heading } from '@/components'
import {
  MainLayout,
  PageContainer,
  SectionContainer,
} from '@/components/layouts'
import * as m from '@/generated/paraglide/messages'
import { useTRPC } from '@/lib/trpc/react'
import { Route } from '@/routes/{-$locale}/_authenticated/dashboard/identifier/$id/edit'
import { useSuspenseQuery } from '@tanstack/react-query'
import { EditIdentifierForm } from '../forms'
import { useUpdateIdentifier } from '../hooks'

export const EditIdentifierPage = () => {
  const { id } = Route.useParams()
  const trpc = useTRPC()

  const { data: identifier } = useSuspenseQuery(
    trpc.identifier.getById.queryOptions({ id }),
  )

  const { form, onSubmit, hasChanges, isPending } =
    useUpdateIdentifier(identifier)

  return (
    <PageContainer withHeader withFooter>
      <SectionContainer container padded className="min-h-screen">
        <MainLayout
          headerContent={
            <Heading size={'h2'}>{m.page_identifier_title()}</Heading>
          }
        >
          <EditIdentifierForm
            form={form}
            onSubmit={onSubmit}
            hasChanges={hasChanges}
            isPending={isPending}
            thumbnail={identifier.thumbnail}
            identifierId={identifier.id}
          />
        </MainLayout>
      </SectionContainer>
    </PageContainer>
  )
}
