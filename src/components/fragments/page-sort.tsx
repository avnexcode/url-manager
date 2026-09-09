import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import * as m from '@/generated/paraglide/messages'
import type { SortItem } from '@/hooks'
import { renderElements } from '@/utils'
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from 'lucide-react'
import { Button } from '../ui/button'

type SortOption = {
  id: string
  label: string
}

type PageSortProps = {
  options: SortOption[]
  sort: SortItem[]
  onSortChange: (sort: SortItem[]) => void
}

export const PageSort = ({ options, sort, onSortChange }: PageSortProps) => {
  const currentSort = sort[0] ?? { id: options[0]?.id ?? '', desc: true }

  const handleFieldChange = (id: string) => {
    onSortChange([{ id, desc: currentSort.desc }])
  }

  const handleToggleDirection = () => {
    onSortChange([{ id: currentSort.id, desc: !currentSort.desc }])
  }

  return (
    <div className="flex items-center gap-1">
      <Select value={currentSort.id} onValueChange={handleFieldChange}>
        <SelectTrigger className="w-35 capitalize">
          <SelectValue placeholder={m.component_page_sort_placeholder()} />
        </SelectTrigger>
        <SelectContent position="popper" sideOffset={2} align="end">
          {renderElements({
            of: options,
            keyExtractor: (option) => option.id,
            render: (option) => (
              <SelectItem
                value={option.id}
                className="cursor-pointer capitalize"
              >
                {option.label}
              </SelectItem>
            ),
          })}
        </SelectContent>
      </Select>

      <Button
        type="button"
        variant="neutral"
        size="icon"
        className="size-9 shrink-0"
        onClick={handleToggleDirection}
        aria-label={
          currentSort.desc ? m.action_sort_desc() : m.action_sort_asc()
        }
      >
        {currentSort.desc ? (
          <ArrowDownWideNarrow className="size-4" />
        ) : (
          <ArrowUpNarrowWide className="size-4" />
        )}
      </Button>
    </div>
  )
}

export const PageSortSkeleton = () => {
  return (
    <div className="flex items-center gap-1">
      <Select disabled>
        <SelectTrigger className="w-32.5">
          {m.component_page_sort_skeleton()}
        </SelectTrigger>
      </Select>
      <Button
        variant="neutral"
        size="icon"
        className="size-9 shrink-0"
        disabled
      >
        <ArrowDownWideNarrow className="size-4" />
      </Button>
    </div>
  )
}
