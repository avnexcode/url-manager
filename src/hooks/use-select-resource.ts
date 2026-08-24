import { useEffect, useState } from 'react'
import type { FieldValues, Path } from 'react-hook-form'
import { useFormContext } from 'react-hook-form'
import { useSelectParams } from './use-select-params'

type SelectResourceQueries<TItem> = {
  useGetById: (id: string | undefined) => {
    data: TItem | undefined
    isLoading: boolean
  }
  useGetAll: (params: { page: number; search?: string }) => {
    data: { data: TItem[]; meta: { total: number } } | undefined
    isLoading: boolean
  }
}

export const useSelectResource = <
  T extends FieldValues,
  TItem extends { id: string },
>(
  name: Path<T>,
  queries: SelectResourceQueries<TItem>,
) => {
  const [isReady, setIsReady] = useState(false)
  const [totalData, setTotalData] = useState(0)
  const ITEMS_PER_PAGE = 10

  const {
    page,
    totalPages,
    searchTerm,
    debouncedSearchTerm,
    handlePageChange,
    handleSearchChange,
    handleSearchInputClick,
  } = useSelectParams({ totalData, itemsPerPage: ITEMS_PER_PAGE })

  const form = useFormContext<T>()
  const selectedId = form.watch(name) as string | undefined

  const { data: selectedItem, isLoading: isSelectedLoading } =
    queries.useGetById(selectedId || undefined)
  const { data: items, isLoading: isItemsLoading } = queries.useGetAll({
    page,
    search: debouncedSearchTerm || undefined,
  })

  useEffect(() => {
    if (items && !isItemsLoading) {
      setIsReady(true)
      setTotalData(items.meta.total)
    }
  }, [form.control, items, isItemsLoading])

  const allItems = items?.data ?? []
  const combinedItems =
    selectedItem && !allItems.some((i) => i.id === selectedItem.id)
      ? [selectedItem, ...allItems]
      : allItems

  return {
    form,
    selectedItem,
    combinedItems,
    page,
    totalPages,
    searchTerm,
    isReady,
    isItemsLoading,
    isSelectedLoading,
    handlePageChange,
    handleSearchChange,
    handleSearchInputClick,
  }
}
