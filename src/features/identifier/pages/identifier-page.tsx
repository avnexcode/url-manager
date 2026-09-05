import { Heading } from '@/components'
import { ActionLink, EmptyState } from '@/components/elements'
import {
  ConfirmDialog,
  PageLimit,
  PagePagination,
  PageSearch,
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
import { IdentifierCard, IdentifierCardSkeleton } from '../components'
import { useBulkDeleteIdentifiers } from '../hooks'

export const IdentifierPage = () => {
  const trpc = useTRPC()

  const { queryParams, handleUpdateQuery } = useQueryParams()

  const { data: identifiers, isLoading: isIdentifiersLoading } = useQuery(
    trpc.identifier.getAll.queryOptions({ params: { ...queryParams } }),
  )

  const allIdentifierIds =
    identifiers?.data.map((identifier) => identifier.id) ?? []

  const {
    selectedList: identifierIds,
    selectedCount,
    toggle,
    isSelected,
    toggleAll,
    isAllSelected,
    isIndeterminate,
    clearSelection,
  } = useSelectionSet(allIdentifierIds)

  const [isOpen, setIsOpen] = useState<boolean>(false)

  const { onDelete, isPending, variables } = useBulkDeleteIdentifiers({
    onSuccess: () => clearSelection(),
    onError: () => clearSelection(),
    redirect: false,
  })

  const handleDelete = () => onDelete({ ids: identifierIds })

  const isIdentifierPending = (identifierId: string) => {
    return isPending && (variables?.request.ids.includes(identifierId) ?? false)
  }

  return (
    <MainLayout
      headerContent={
        <>
          <Heading size={'h2'}>{m.page_identifier_title()}</Heading>
          <ActionLink
            action="createNew"
            to="/{-$locale}/dashboard/identifier/create"
          />
        </>
      }
    >
      <header className="my-5">
        <div className="my-5 flex flex-col justify-between gap-x-10 gap-y-3 sm:flex-row sm:items-center">
          <PageSearch
            value={queryParams.search}
            onSearchChange={(search) => handleUpdateQuery({ search, page: 1 })}
            placeholder={`${m.model_identifier_field_title()}, ${m.model_identifier_field_slug()}`}
          />
        </div>
        <div className="flex items-center justify-end gap-2">
          <PageLimit
            totalData={identifiers?.meta.total ?? 0}
            currentLimit={queryParams.limit}
            onLimitChange={(limit) => handleUpdateQuery({ limit })}
          />
        </div>
        <div className="flex items-center gap-x-3 sm:gap-x-5">
          {identifiers?.data.length !== 0 ? (
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
          ) : identifiers?.data.length !== 0 ? (
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
      {isIdentifiersLoading
        ? renderElements({
            of: [...new Array<undefined>(15)],
            keyExtractor: (_, i) => i,
            render: () => <IdentifierCardSkeleton />,
          })
        : renderElements({
            of: identifiers?.data,
            keyExtractor: (identifier) => identifier.id,
            render: (identifier) => {
              return (
                <IdentifierCard
                  identifier={identifier}
                  onCheckedChange={(checked) => toggle(identifier.id, checked)}
                  checked={isSelected(identifier.id)}
                  isPending={isIdentifierPending(identifier.id)}
                />
              )
            },
            isLoading: isIdentifiersLoading,
            fallback: (
              <EmptyState title={m.component_identifier_empty_state()} />
            ),
          })}
      <footer className="pt-5">
        <PagePagination
          total={identifiers?.meta.total ?? 0}
          currentPage={queryParams.page}
          limit={queryParams.limit}
          onPageChange={(page) => handleUpdateQuery({ page })}
          className="flex justify-end xl:max-w-fit"
          showPageList
        />
      </footer>
      <ConfirmDialog
        variant="delete"
        model={m.model_identifier_title()}
        open={isOpen}
        onOpenChange={setIsOpen}
        onConfirm={handleDelete}
        isPending={isPending}
      />
    </MainLayout>
  )
}
