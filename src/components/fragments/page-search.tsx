import { Input } from '@/components/ui/input'
import * as m from '@/generated/paraglide/messages'
import { useDebounce } from '@/hooks'
import { capitalizeSentence } from '@/utils'
import { CircleXIcon } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'

type PageSearchProps = {
  value: string
  onSearchChange: (search: string) => void
  placeholder: string
}

export const PageSearch = ({
  value,
  onSearchChange,
  placeholder = '',
}: PageSearchProps) => {
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [search, setSearch] = useState(value)
  const debouncedSearch = useDebounce(search, 1000)

  useEffect(() => {
    if (value !== search) {
      setSearch(value)
    }
  }, [value])

  useEffect(() => {
    if (debouncedSearch !== value) {
      onSearchChange(debouncedSearch)
    }
  }, [debouncedSearch, value, onSearchChange])

  const handleClearInput = () => {
    setSearch('')
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <div className="relative w-full">
      <Input
        id={id}
        ref={inputRef}
        className="min-w-75"
        placeholder={`${capitalizeSentence(placeholder)} . . .`}
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        autoComplete="off"
      />
      {search && (
        <button
          className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 inset-e-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={m.action_clear()}
          onClick={handleClearInput}
        >
          <CircleXIcon size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
