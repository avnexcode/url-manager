import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { renderElements } from '@/utils'

type PageLimitProps = {
  totalData: number
  currentLimit: number
  onLimitChange: (limit: number) => void
}

const LIMIT_OPTIONS = [15, 30, 50, 100]

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
      <SelectTrigger
        className="w-32.5 bg-secondary-background"
        disabled={totalData <= smallestLimit}
      >
        <SelectValue placeholder="Limit per page" />
      </SelectTrigger>
      <SelectContent
        position="popper"
        sideOffset={2}
        align="end"
        className="bg-secondary-background *:cursor-pointer"
      >
        {renderElements({
          of: LIMIT_OPTIONS,
          keyExtractor: (limit) => limit,
          render: (limit, index) => {
            const previousLimit = LIMIT_OPTIONS[index - 1] ?? 0
            const isDisabled = index === 0 ? false : totalData <= previousLimit

            return (
              <SelectItem value={limit.toString()} disabled={isDisabled}>
                Limit {limit}
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
      <SelectTrigger className="w-32.5">Limit 15</SelectTrigger>
    </Select>
  )
}
