import { useState } from 'react'

export const useSelectionSet = <T>(allItems: T[]) => {
  const [selectedItems, setSelectedItems] = useState<Set<T>>(new Set())

  const toggle = (item: T, checked: boolean) => {
    setSelectedItems((prev) => {
      const next = new Set(prev)
      checked ? next.add(item) : next.delete(item)
      return next
    })
  }

  const isSelected = (item: T): boolean => selectedItems.has(item)

  const toggleAll = (checked: boolean) => {
    setSelectedItems(checked ? new Set(allItems) : new Set())
  }

  const isAllSelected =
    allItems.length > 0 && allItems.every((item) => selectedItems.has(item))

  const isIndeterminate =
    allItems.some((item) => selectedItems.has(item)) && !isAllSelected

  const selectedList = [...selectedItems]

  const selectedCount = selectedItems.size

  const clearSelection = () => setSelectedItems(new Set())

  return {
    selectedItems,
    selectedList,
    selectedCount,
    toggle,
    isSelected,
    toggleAll,
    isAllSelected,
    isIndeterminate,
    clearSelection,
  }
}
