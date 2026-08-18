import { useState } from 'react'

export const useSelectionSet = <T>(allIds: T[]) => {
  const [selectedIds, setSelectedIds] = useState<Set<T>>(new Set())

  const toggle = (id: T, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      checked ? next.add(id) : next.delete(id)
      return next
    })
  }

  const isSelected = (id: T): boolean => selectedIds.has(id)

  const toggleAll = (checked: boolean) => {
    setSelectedIds(checked ? new Set(allIds) : new Set())
  }

  const isAllSelected =
    allIds.length > 0 && allIds.every((id) => selectedIds.has(id))

  const isIndeterminate =
    allIds.some((id) => selectedIds.has(id)) && !isAllSelected

  const selectedArray = [...selectedIds]

  const selectedCount = selectedIds.size

  const clear = () => setSelectedIds(new Set())

  return {
    selectedIds,
    selectedArray,
    selectedCount,
    toggle,
    isSelected,
    toggleAll,
    isAllSelected,
    isIndeterminate,
    clear,
  }
}
