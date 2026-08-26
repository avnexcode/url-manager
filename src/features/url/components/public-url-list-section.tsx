import { EmptyState } from '@/components/elements'
import { PageLimit, PagePagination, PageSearch } from '@/components/fragments'
import * as m from '@/generated/paraglide/messages'
import type { SearchParams } from '@/hooks'
import type { QueryResponse } from '@/interfaces'
import { renderElements } from '@/utils'
import type { PublicUrlResponse } from '../types'
import { PublicUrlCard, PublicUrlCardSkeleton } from './public-url-card'

type PublicUrlListSectionProps = {
  urls?: QueryResponse<PublicUrlResponse>
  isUrlsLoading: boolean
  queryParams: SearchParams
  handleUpdateQuery: (params: Partial<SearchParams>) => void
}

export const PublicUrlListSection = ({
  urls,
  isUrlsLoading,
  queryParams,
  handleUpdateQuery,
}: PublicUrlListSectionProps) => {
  return (
    <>
      <header className="my-3">
        <div className="my-3 flex flex-col justify-between gap-x-10 gap-y-3 sm:flex-row sm:items-center">
          <PageSearch
            value={queryParams.search}
            onSearchChange={(search) => handleUpdateQuery({ search, page: 1 })}
            placeholder={`${m.model_url_field_title()}, ${m.model_url_field_slug()}`}
          />
        </div>
        <div className="flex items-center justify-end gap-2">
          <PageLimit
            totalData={urls?.meta.total ?? 0}
            currentLimit={queryParams.limit}
            onLimitChange={(limit) => handleUpdateQuery({ limit })}
          />
        </div>
      </header>

      {isUrlsLoading
        ? renderElements({
            of: [...new Array<undefined>(15)],
            keyExtractor: (_, i) => i,
            render: () => <PublicUrlCardSkeleton />,
          })
        : renderElements({
            of: urls?.data,
            keyExtractor: (url) => url.slug,
            render: (url) => <PublicUrlCard url={url} />,
            isLoading: isUrlsLoading,
            fallback: <EmptyState title={m.component_url_empty_state()} />,
          })}

      <footer>
        <PagePagination
          total={urls?.meta.total ?? 0}
          currentPage={queryParams.page}
          limit={queryParams.limit}
          onPageChange={(page) => handleUpdateQuery({ page })}
          className="flex justify-end xl:max-w-fit"
          showPageList
        />
      </footer>
    </>
  )
}
