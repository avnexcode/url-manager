import { Heading } from '@/components'
import { EmptyState } from '@/components/elements'
import {
  PageLimit,
  PagePagination,
  PageSearch,
  PageSort,
} from '@/components/fragments'
import { PublicLayout } from '@/components/layouts'
import * as m from '@/generated/paraglide/messages'
import { useQueryParams } from '@/hooks'
import { useTRPC } from '@/lib/trpc/react'
import { Route } from '@/routes/{-$locale}/_public/$username/platform'
import { renderElements } from '@/utils'
import { useSuspenseQuery } from '@tanstack/react-query'
import { PublicPlatformCard } from '../../components'

export const PlatformPage = () => {
  const { username } = Route.useParams()

  const trpc = useTRPC()

  const { queryParams, handleUpdateQuery } = useQueryParams([
    { id: 'title', desc: false },
  ])

  const { data: platforms } = useSuspenseQuery(
    trpc.platform.getPubllicAll.queryOptions({
      username,
      params: { ...queryParams },
    }),
  )

  return (
    <PublicLayout
      headerContent={<Heading size={'h2'}>{m.page_platform_title()}</Heading>}
    >
      <header className="my-5 space-y-5">
        <div className="my-5 flex flex-col justify-between gap-x-10 gap-y-3 sm:flex-row sm:items-center">
          <PageSearch
            value={queryParams.search}
            onSearchChange={(search) => handleUpdateQuery({ search, page: 1 })}
            placeholder={`${m.model_platform_field_title()}, ${m.model_platform_field_slug()}`}
          />
        </div>
        <div className="flex items-end xl:items-end justify-end gap-2 flex-col xl:flex-row">
          <PageLimit
            totalData={platforms.meta.total}
            currentLimit={queryParams.limit}
            onLimitChange={(limit) => handleUpdateQuery({ limit })}
          />
          <PageSort
            options={[{ id: 'title', label: m.model_platform_field_title() }]}
            sort={queryParams.sort}
            onSortChange={(sort) => handleUpdateQuery({ sort })}
          />
        </div>
      </header>
      {renderElements({
        of: platforms.data,
        keyExtractor: ({ slug }) => slug,
        render: (platform) => {
          return <PublicPlatformCard platform={platform} />
        },
        fallback: <EmptyState title={m.component_platform_empty_state()} />,
      })}
      <footer className="pt-5">
        <PagePagination
          total={platforms.meta.total}
          currentPage={queryParams.page}
          limit={queryParams.limit}
          onPageChange={(page) => handleUpdateQuery({ page })}
          className="flex justify-end xl:max-w-fit"
          showPageList
        />
      </footer>
    </PublicLayout>
  )
}
