import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { renderElements } from '@/utils'
import * as m from '@/generated/paraglide/messages'

type PageLimitProps = {
  totalData: number
  currentLimit: number
  onLimitChange: (limit: number) => void
}

const LIMIT_OPTIONS = [15, 30, 50, 100, 150, 250, 500]

export const PageLimit = ({
  totalData,
  currentLimit,
  onLimitChange,
}: PageLimitProps) => {
  const smallestLimit = LIMIT_OPTIONS[0]

  return (
    <Select
      value={currentLimit.toString()}
      onValueChange={(value) => onLimitChange(Number(value))}
    >
      <SelectTrigger className="w-32.5" disabled={totalData <= smallestLimit}>
        <SelectValue placeholder={m.component_page_limit_placeholder()} />
      </SelectTrigger>
      <SelectContent position="popper" sideOffset={2} align="end">
        {renderElements({
          of: LIMIT_OPTIONS,
          keyExtractor: (limit) => limit,
          render: (limit, index) => {
            const previousLimit = LIMIT_OPTIONS[index - 1] ?? 0
            const isDisabled = index === 0 ? false : totalData <= previousLimit

            return (
              <SelectItem
                value={limit.toString()}
                disabled={isDisabled}
                className="cursor-pointer"
              >
                {m.component_page_limit_item({ limit })}
              </SelectItem>
            )
          },
        })}
      </SelectContent>
    </Select>
  )
}

export const PageLimitSkeleton = () => {
  return (
    <Select disabled>
      <SelectTrigger className="w-32.5">
        {m.component_page_limit_skeleton()}
      </SelectTrigger>
    </Select>
  )
}
