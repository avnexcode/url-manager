import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/lib/utils'
import { renderElements } from '@/utils'

type PagePaginationProps = {
  className?: string
  total: number
  currentPage: number
  limit: number
  onPageChange: (page: number) => void
  showPageList?: boolean
}

export const PagePagination = ({
  className,
  total,
  currentPage,
  limit,
  onPageChange,
  showPageList = false,
}: PagePaginationProps) => {
  const totalPages = Math.ceil(total / limit)

  if (totalPages <= 1) return null

  const pages: number[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 2 && i <= currentPage + 2)
    ) {
      pages.push(i)
    }
  }

  return (
    <Pagination className={cn(className)}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={
              currentPage === 1
                ? 'pointer-events-none opacity-50'
                : 'cursor-pointer'
            }
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          />
        </PaginationItem>
        {showPageList &&
          renderElements({
            of: pages,
            keyExtractor: (page) => `ellipsis-${page}`,
            render: (page, index) => {
              if (index > 0 && pages[index - 1] !== page - 1) {
                return (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )
              }
              return (
                <PaginationItem>
                  <PaginationLink
                    onClick={() => onPageChange(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            },
          })}
        <PaginationItem>
          <PaginationNext
            className={
              currentPage === totalPages
                ? 'pointer-events-none opacity-50'
                : 'cursor-pointer'
            }
            onClick={() =>
              currentPage < totalPages && onPageChange(currentPage + 1)
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export const PagePaginationSkeleton = () => {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious className="pointer-events-none opacity-50" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink className="pointer-events-none opacity-50">
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink className="pointer-events-none opacity-50">
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink className="pointer-events-none opacity-50">
            3
          </PaginationLink>
        </PaginationItem>
        <PaginationItem className="pointer-events-none opacity-50">
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext className="pointer-events-none opacity-50" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
