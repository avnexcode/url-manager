import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../ui/button'

type SelectPaginationProps = {
  currentPage: number
  totalPages: number
  isLoading: boolean
  onPageChange: (page: number) => void
}

export const SelectPagination = ({
  currentPage,
  totalPages,
  isLoading,
  onPageChange,
}: SelectPaginationProps) => {
  const handlePageChangeClick = (e: React.MouseEvent, page: number) => {
    e.preventDefault()
    onPageChange(page)
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between border-t px-2 py-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => handlePageChangeClick(e, currentPage - 1)}
        disabled={currentPage <= 1 || isLoading}
        className="h-8 w-8 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-xs text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => handlePageChangeClick(e, currentPage + 1)}
        disabled={currentPage >= totalPages || isLoading}
        className="h-8 w-8 p-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
