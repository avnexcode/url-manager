import type { ChangeEvent, MouseEvent } from 'react'
import { useEffect, useState } from 'react'
import { useDebounce } from './use-debounce'

type UseSelectParamsProps = {
  totalData: number
  itemsPerPage: number
}

export const useSelectParams = ({
  totalData,
  itemsPerPage,
}: UseSelectParamsProps) => {
  const [page, setPage] = useState<number>(1)
  const [searchTerm, setSearchTerm] = useState<string>('')

  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  useEffect(() => {
    setPage(1)
  }, [debouncedSearchTerm])

  const totalPages = Math.max(1, Math.ceil(totalData / itemsPerPage))

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return
    setPage(newPage)
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleSearchInputClick = (e: MouseEvent) => {
    e.stopPropagation()
  }

  return {
    page,
    totalPages,
    searchTerm,
    debouncedSearchTerm,
    handlePageChange,
    handleSearchChange,
    handleSearchInputClick,
  }
}
