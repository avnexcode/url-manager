import { Heading, Icon } from '@/components'
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
import { PlatformCard, PlatformCardSkeleton } from '../components'
import { useBulkDeletePlatforms } from '../hooks'
import { ActionLink, EmptyState } from '@/components/elements'

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

  const { onBulkDelete, isPending, variables } = useBulkDeletePlatforms({
    onSuccess: () => clearSelection(),
    onError: () => clearSelection(),
    redirect: false,
  })

  const onDelete = () => onBulkDelete({ ids: platformIds })

  const isPlatformPending = (platformId: string) => {
    return isPending && (variables?.request.ids.includes(platformId) ?? false)
  }

  return (
    <PageContainer withHeader withFooter>
      <SectionContainer container padded className="min-h-screen">
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
          <header className="my-3">
            <div className="my-3 flex flex-col justify-between gap-x-10 gap-y-3 sm:flex-row sm:items-center">
              <PageSearch
                value={queryParams.search}
                onSearchChange={(search) =>
                  handleUpdateQuery({ search, page: 1 })
                }
                placeholder={m.model_platform_field_title()}
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <PageLimit
                totalData={platforms?.meta.total ?? 0}
                currentLimit={queryParams.limit}
                onLimitChange={(limit) => handleUpdateQuery({ limit })}
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
                  <Icon name="Trash2" />({selectedCount}) {m.action_delete()}
                </Button>
              ) : platforms?.data.length !== 0 ? (
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
                      onCheckedChange={(checked) =>
                        toggle(platform.id, checked)
                      }
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
          <footer>
            <PagePagination
              total={platforms?.meta.total ?? 0}
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
          model={m.model_platform_title()}
          open={isOpen}
          onOpenChange={setIsOpen}
          onConfirm={onDelete}
          isPending={isPending}
        />
      </SectionContainer>
    </PageContainer>
  )
}
