import { useSelectionSet } from '@/hooks'
import { useState } from 'react'
import { useBulkDeleteUrls } from './use-bulk-delete-url'

export type UrlListRelation = { platformId: string } | { identifierId: string }

export const useUrlListActions = (allUrlIds: string[]) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

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

  const { onDelete, isPending, variables } = useBulkDeleteUrls({
    onSuccess: () => clearSelection(),
    onError: () => clearSelection(),
    redirect: false,
  })

  const isUrlPending = (urlId: string) =>
    isPending && (variables?.request.ids.includes(urlId) ?? false)

  return {
    toggle,
    isSelected,
    toggleAll,
    isAllSelected,
    isIndeterminate,
    selectedCount,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleDelete: () => onDelete({ ids: urlIds }),
    isPending,
    isUrlPending,
  }
}
