import { Heading } from '@/components'
import { EmptyState } from '@/components/elements'
import { PageLimit, PagePagination, PageSearch } from '@/components/fragments'
import {
  PageContainer,
  PublicLayout,
  SectionContainer,
} from '@/components/layouts'
import * as m from '@/generated/paraglide/messages'
import { useQueryParams } from '@/hooks'
import { useTRPC } from '@/lib/trpc/react'
import { Route } from '@/routes/{-$locale}/_public/$username/identifier'
import { renderElements } from '@/utils'
import { useSuspenseQuery } from '@tanstack/react-query'
import { PublicIdentifierCard } from '../../components'

export const IdentifierPage = () => {
  const { username } = Route.useParams()

  const trpc = useTRPC()

  const { queryParams, handleUpdateQuery } = useQueryParams()

  const { data: identifiers } = useSuspenseQuery(
    trpc.identifier.getPubllicAll.queryOptions({
      username,
      params: { ...queryParams },
    }),
  )

  return (
    <PageContainer withFooter>
      <SectionContainer container padded className="min-h-screen">
        <PublicLayout
          headerContent={
            <Heading size={'h2'}>{m.page_identifier_title()}</Heading>
          }
        >
          <header className="my-3">
            <div className="my-3 flex flex-col justify-between gap-x-10 gap-y-3 sm:flex-row sm:items-center">
              <PageSearch
                value={queryParams.search}
                onSearchChange={(search) =>
                  handleUpdateQuery({ search, page: 1 })
                }
                placeholder={`${m.model_identifier_field_title()}, ${m.model_identifier_field_slug()}`}
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <PageLimit
                totalData={identifiers.meta.total}
                currentLimit={queryParams.limit}
                onLimitChange={(limit) => handleUpdateQuery({ limit })}
              />
            </div>
          </header>
          {renderElements({
            of: identifiers.data,
            keyExtractor: ({ slug }) => slug,
            render: (identifier) => {
              return <PublicIdentifierCard identifier={identifier} />
            },
            fallback: (
              <EmptyState title={m.component_identifier_empty_state()} />
            ),
          })}
          <footer className="pt-5">
            <PagePagination
              total={identifiers.meta.total}
              currentPage={queryParams.page}
              limit={queryParams.limit}
              onPageChange={(page) => handleUpdateQuery({ page })}
              className="flex justify-end xl:max-w-fit"
              showPageList
            />
          </footer>
        </PublicLayout>
      </SectionContainer>
    </PageContainer>
  )
}
