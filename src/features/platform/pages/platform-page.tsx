import { Heading } from '@/components'
import { ActionLink, EmptyState } from '@/components/elements'
import {
  ConfirmDialog,
  PageLimit,
  PagePagination,
  PageSearch,
  PageSort,
} from '@/components/fragments'
import { MainLayout } from '@/components/layouts'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import * as m from '@/generated/paraglide/messages'
import { useQueryParams, useSelectionSet } from '@/hooks'
import { useTRPC } from '@/lib/trpc/react'
import { renderElements } from '@/utils'
import { useQuery } from '@tanstack/react-query'
import { Loader2, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { PlatformCard, PlatformCardSkeleton } from '../components'
import { useBulkDeletePlatforms } from '../hooks'

export const PlatformPage = () => {
  const trpc = useTRPC()

  const { queryParams, handleUpdateQuery } = useQueryParams()

  const { data: platforms, isLoading: isPlatformsLoading } = useQuery(
    trpc.platform.getAll.queryOptions({ params: { ...queryParams } }),
  )

  const allPlatformIds = platforms?.data.map((platform) => platform.id) ?? []

  const {
    selectedList: platformIds,
    selectedCount,
    toggle,
    isSelected,
    toggleAll,
    isAllSelected,
    isIndeterminate,
    clearSelection,
  } = useSelectionSet(allPlatformIds)

  const [isOpen, setIsOpen] = useState<boolean>(false)

  const { onDelete, isPending, variables } = useBulkDeletePlatforms({
    onSuccess: () => clearSelection(),
    onError: () => clearSelection(),
    redirect: false,
  })

  const handleDelete = () => onDelete({ ids: platformIds })

  const isPlatformPending = (platformId: string) => {
    return isPending && (variables?.request.ids.includes(platformId) ?? false)
  }

  return (
    <MainLayout
      headerContent={
        <>
          <Heading size={'h2'}>{m.page_platform_title()}</Heading>
          {platforms?.meta && platforms.meta.total > 0 && (
            <ActionLink
              action="createNew"
              to="/{-$locale}/dashboard/platform/create"
            />
          )}
        </>
      }
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
            totalData={platforms?.meta.total ?? 0}
            currentLimit={queryParams.limit}
            onLimitChange={(limit) => handleUpdateQuery({ limit })}
          />
          <PageSort
            options={[
              { id: 'title', label: m.model_platform_field_title() },
              { id: 'createdAt', label: m.model_platform_field_created_at() },
              { id: 'updatedAt', label: m.model_platform_field_updated_at() },
            ]}
            sort={queryParams.sort}
            onSortChange={(sort) => handleUpdateQuery({ sort })}
          />
        </div>
        <div className="flex items-center gap-x-3 sm:gap-x-5">
          {platforms?.data.length !== 0 ? (
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
          ) : platforms?.data.length !== 0 ? (
            <Button
              variant={'neutral'}
              size={'sm'}
              disabled
              className="h-7 max-w-fit rounded-sm text-xs"
            >
              <Trash2 />({selectedCount}) {m.action_delete()}
            </Button>
          ) : null}
        </div>
      </header>
      {isPlatformsLoading
        ? renderElements({
            of: [...new Array<undefined>(15)],
            keyExtractor: (_, i) => i,
            render: () => <PlatformCardSkeleton />,
          })
        : renderElements({
            of: platforms?.data,
            keyExtractor: (platform) => platform.id,
            render: (platform) => {
              return (
                <PlatformCard
                  platform={platform}
                  onCheckedChange={(checked) => toggle(platform.id, checked)}
                  checked={isSelected(platform.id)}
                  isPending={isPlatformPending(platform.id)}
                />
              )
            },
            isLoading: isPlatformsLoading,
            fallback: (
              <EmptyState
                title={m.component_platform_empty_state()}
                action={
                  <ActionLink
                    action="createNew"
                    to="/{-$locale}/dashboard/platform/create"
                  />
                }
              />
            ),
          })}
      <footer className="pt-5">
        <PagePagination
          total={platforms?.meta.total ?? 0}
          currentPage={queryParams.page}
          limit={queryParams.limit}
          onPageChange={(page) => handleUpdateQuery({ page })}
          className="flex justify-end xl:max-w-fit"
          showPageList
        />
      </footer>
      <ConfirmDialog
        variant="delete"
        model={m.model_platform_title()}
        open={isOpen}
        onOpenChange={setIsOpen}
        onConfirm={handleDelete}
        isPending={isPending}
      />
    </MainLayout>
  )
}
