import { ActionLink, EmptyState } from '@/components/elements'
import {
  ConfirmDialog,
  PageLimit,
  PagePagination,
  PageSearch,
  PageSort,
} from '@/components/fragments'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import * as m from '@/generated/paraglide/messages'
import type { SearchParams } from '@/hooks'
import type { QueryResponse } from '@/interfaces'
import type { UrlSearchSchema } from '@/routes/{-$locale}/_authenticated/dashboard/url/create'
import { renderElements } from '@/utils'
import { Loader2, Trash2 } from 'lucide-react'
import type { useUrlListActions } from '../hooks'
import type { UrlResponse } from '../types'
import { UrlCard, UrlCardSkeleton } from './url-card'

type UrlListSectionProps = {
  urls?: QueryResponse<UrlResponse>
  isUrlsLoading: boolean
  queryParams: SearchParams
  handleUpdateQuery: (params: Partial<SearchParams>) => void
  actions: ReturnType<typeof useUrlListActions>
  searchParams?: UrlSearchSchema
}

export const UrlListSection = ({
  urls,
  isUrlsLoading,
  queryParams,
  handleUpdateQuery,
  actions,
  searchParams,
}: UrlListSectionProps) => {
  const {
    toggle,
    isSelected,
    toggleAll,
    isAllSelected,
    isIndeterminate,
    selectedCount,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleDelete,
    isPending,
    isUrlPending,
  } = actions

  return (
    <>
      <header className="my-5 space-y-5">
        <div className="my-5 flex flex-col justify-between gap-x-10 gap-y-3 sm:flex-row sm:items-center">
          <PageSearch
            value={queryParams.search}
            onSearchChange={(search) => handleUpdateQuery({ search, page: 1 })}
            placeholder={`${m.model_url_field_title()}, ${m.model_url_field_slug()}`}
          />
        </div>
        <div className="flex items-end xl:items-end justify-end gap-2 flex-col xl:flex-row">
          <PageLimit
            totalData={urls?.meta.total ?? 0}
            currentLimit={queryParams.limit}
            onLimitChange={(limit) => handleUpdateQuery({ limit })}
          />
          <PageSort
            options={[
              { id: 'title', label: m.model_url_field_title() },
              { id: 'createdAt', label: m.model_url_field_created_at() },
              { id: 'updatedAt', label: m.model_url_field_updated_at() },
            ]}
            sort={queryParams.sort}
            onSortChange={(sort) => handleUpdateQuery({ sort })}
          />
        </div>
        <div className="flex items-center gap-x-3 sm:gap-x-5">
          {urls?.data.length !== 0 ? (
            <Checkbox
              checked={isAllSelected}
              ref={(element) => {
                if (element) {
                  ;(element as unknown as HTMLInputElement).indeterminate =
                    isIndeterminate
                }
              }}
              onCheckedChange={toggleAll}
            />
          ) : null}

          {selectedCount > 0 ? (
            <Button
              variant="destructive"
              size="sm"
              disabled={isPending}
              className="h-7 max-w-fit rounded-sm text-xs"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              {!isPending ? (
                <>
                  <Trash2 />({selectedCount}) {m.action_delete()}
                </>
              ) : (
                <>
                  <Loader2 className="animate-spin" />
                  {m.action_delete_loading()}...
                </>
              )}
            </Button>
          ) : urls?.data.length !== 0 ? (
            <Button
              variant="neutral"
              size="sm"
              disabled
              className="h-7 max-w-fit rounded-sm text-xs"
            >
              <Trash2 />({selectedCount}) {m.action_delete()}
            </Button>
          ) : null}
        </div>
      </header>

      {isUrlsLoading
        ? renderElements({
            of: [...new Array<undefined>(15)],
            keyExtractor: (_, i) => i,
            render: () => <UrlCardSkeleton />,
          })
        : renderElements({
            of: urls?.data,
            keyExtractor: (url) => url.id,
            render: (url) => (
              <UrlCard
                url={url}
                onCheckedChange={(checked) => toggle(url.id, checked)}
                checked={isSelected(url.id)}
                isPending={isUrlPending(url.id)}
                searchParams={searchParams}
              />
            ),
            isLoading: isUrlsLoading,
            fallback: (
              <EmptyState
                title={m.component_url_empty_state()}
                action={
                  <ActionLink
                    action="createNew"
                    to="/{-$locale}/dashboard/url/create"
                    search={searchParams}
                  />
                }
              />
            ),
          })}

      <footer className="pt-5">
        <PagePagination
          total={urls?.meta.total ?? 0}
          currentPage={queryParams.page}
          limit={queryParams.limit}
          onPageChange={(page) => handleUpdateQuery({ page })}
          className="flex justify-end xl:max-w-fit"
          showPageList
        />
      </footer>

      <ConfirmDialog
        variant="delete"
        model={m.model_url_title()}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        isPending={isPending}
      />
    </>
  )
}
