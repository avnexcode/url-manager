import { Heading } from '@/components'
import { MainLayout } from '@/components/layouts'
import * as m from '@/generated/paraglide/messages'
import { useTRPC } from '@/lib/trpc/react'
import { Route } from '@/routes/{-$locale}/_authenticated/dashboard/identifier/$id/edit'
import { useQuery } from '@tanstack/react-query'
import { EditIdentifierForm } from '../forms'
import { useUpdateIdentifier } from '../hooks'
import { EditIdentifierFormSkeleton } from '../skeletons'

export const EditIdentifierPage = () => {
  const { id } = Route.useParams()

  const trpc = useTRPC()

  const { data: identifier, isLoading: isIdentifierLoading } = useQuery(
    trpc.identifier.getById.queryOptions({ id }),
  )

  const { form, onSubmit, hasChanges, isPending } = useUpdateIdentifier(
    id,
    identifier,
  )

  return (
    <MainLayout
      headerContent={<Heading size={'h2'}>{m.page_identifier_title()}</Heading>}
    >
      {isIdentifierLoading ? (
        <EditIdentifierFormSkeleton />
      ) : (
        identifier && (
          <EditIdentifierForm
            form={form}
            onSubmit={onSubmit}
            hasChanges={hasChanges}
            isPending={isPending}
            thumbnail={identifier.thumbnail}
            identifierId={identifier.id}
          />
        )
      )}
    </MainLayout>
  )
}
