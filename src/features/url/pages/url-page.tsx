import { Heading, Icon } from '@/components'
import { ActionLink, EmptyState } from '@/components/elements'
import {
  ConfirmDialog,
  PageLimit,
  PagePagination,
  PageSearch,
} from '@/components/fragments'
import {
  MainLayout,
  PageContainer,
  SectionContainer,
} from '@/components/layouts'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import * as m from '@/generated/paraglide/messages'
import { useQueryParams, useSelectionSet } from '@/hooks'
import { useTRPC } from '@/lib/trpc/react'
import { renderElements } from '@/utils'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { UrlCard, UrlCardSkeleton } from '../components'
import { useBulkDeleteUrls } from '../hooks'

export const UrlPage = () => {
  const trpc = useTRPC()

  const { queryParams, handleUpdateQuery } = useQueryParams()

  const { data: urls, isLoading: isUrlsLoading } = useQuery(
    trpc.url.getAll.queryOptions({ params: { ...queryParams } }),
  )

  const allUrlIds = urls?.data.map((url) => url.id) ?? []

  const {
    selectedList: urlIds,
    selectedCount,
    toggle,
    isSelected,
    toggleAll,
    isAllSelected,
    isIndeterminate,
    clearSelection,
  } = useSelectionSet(allUrlIds)

  const [isOpen, setIsOpen] = useState<boolean>(false)

  const { onBulkDelete, isPending, variables } = useBulkDeleteUrls({
    onSuccess: () => clearSelection(),
    onError: () => clearSelection(),
    redirect: false,
  })

  const onDelete = () => onBulkDelete({ ids: urlIds })

  const isUrlPending = (urlId: string) => {
    return isPending && (variables?.request.ids.includes(urlId) ?? false)
  }
  return (
    <PageContainer withHeader withFooter>
      <SectionContainer container padded className="min-h-screen">
        <MainLayout
          headerContent={
            <>
              <Heading size={'h2'}>{m.page_url_title()}</Heading>
              {urls?.meta && urls.meta.total > 0 && (
                <ActionLink
                  action="createNew"
                  to="/{-$locale}/dashboard/url/create"
                />
              )}
            </>
          }
        >
          <header className="my-3">
            <div className="my-3 flex flex-col justify-between gap-x-10 gap-y-3 sm:flex-row sm:items-center">
              <PageSearch
                value={queryParams.search}
                onSearchChange={(search) =>
                  handleUpdateQuery({ search, page: 1 })
                }
                placeholder={m.model_url_field_title()}
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <PageLimit
                totalData={urls?.meta.total ?? 0}
                currentLimit={queryParams.limit}
                onLimitChange={(limit) => handleUpdateQuery({ limit })}
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
                  variant={'destructive'}
                  size={'sm'}
                  disabled={isPending}
                  className="h-7 max-w-fit rounded-sm text-xs"
                  onClick={() => setIsOpen(true)}
                >
                  <Icon name="Trash2" />({selectedCount}) {m.action_delete()}
                </Button>
              ) : urls?.data.length !== 0 ? (
                <Button
                  variant={'neutral'}
                  size={'sm'}
                  disabled
                  className="h-7 max-w-fit rounded-sm text-xs"
                >
                  <Icon name="Trash2" />({selectedCount}) {m.action_delete()}
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
                render: (url) => {
                  return (
                    <UrlCard
                      url={url}
                      onCheckedChange={(checked) => toggle(url.id, checked)}
                      checked={isSelected(url.id)}
                      isPending={isUrlPending(url.id)}
                    />
                  )
                },
                isLoading: isUrlsLoading,
                fallback: (
                  <EmptyState
                    title={m.component_url_empty_state()}
                    action={
                      <ActionLink
                        action="createNew"
                        to="/{-$locale}/dashboard/url/create"
                      />
                    }
                  />
                ),
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
        </MainLayout>
        <ConfirmDialog
          variant="delete"
          model={m.model_url_title()}
          open={isOpen}
          onOpenChange={setIsOpen}
          onConfirm={onDelete}
          isPending={isPending}
        />
      </SectionContainer>
    </PageContainer>
  )
}
