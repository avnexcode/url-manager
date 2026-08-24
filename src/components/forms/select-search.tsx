import { Input } from '@/components/ui/input'
import * as m from '@/generated/paraglide/messages'
import { Search } from 'lucide-react'

type SelectSearchProps = {
  searchTerm: string
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClick: (e: React.MouseEvent) => void
  onFocus?: (e: React.FocusEvent) => void
  onBlur?: () => void
}

export const SelectSearch = ({
  searchTerm,
  onSearchChange,
  onClick,
  onFocus,
  onBlur,
}: SelectSearchProps) => {
  return (
    <div className="flex items-center border-b px-3 py-2" onClick={onClick}>
      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
      <Input
        placeholder={m.form_placeholder_search()}
        value={searchTerm}
        onChange={onSearchChange}
        onKeyDown={(e) => e.stopPropagation()}
        className="h-8 shadow-none focus-visible:ring-1"
        onFocus={onFocus}
        onBlur={onBlur}
        autoFocus
      />
    </div>
  )
}
