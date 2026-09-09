import { useNavigate, useSearch } from '@tanstack/react-router'
import { useMemo } from 'react'
import z from 'zod'

const sortItemSchema = z.object({
  id: z.string(),
  desc: z.boolean(),
})

export type SortItem = z.infer<typeof sortItemSchema>

const DEFAULT_SORT: SortItem[] = [{ id: 'createdAt', desc: true }]

export const createSearchSchema = (defaultSort: SortItem[] = DEFAULT_SORT) =>
  z.object({
    search: z.string().default(''),
    page: z.number().int().default(1),
    sort: z.array(sortItemSchema).default(defaultSort),
    limit: z.number().int().default(15),
  })

export type SearchParams = z.infer<ReturnType<typeof createSearchSchema>>

export const searchSchema = createSearchSchema()

export const useQueryParams = (defaultSort?: SortItem[]) => {
  const schema = useMemo(() => createSearchSchema(defaultSort), [defaultSort])

  const params = useSearch({ strict: false })
  const queryParams = schema.parse(params)
  const navigate = useNavigate()

  const handleUpdateQuery = (newParams: Partial<SearchParams>) => {
    const shouldResetPage =
      ('limit' in newParams || 'sort' in newParams) && !('page' in newParams)

    void navigate({
      search: ((prev: SearchParams) => ({
        ...prev,
        ...newParams,
        ...(shouldResetPage && { page: 1 }),
      })) as unknown as true,
      replace: true,
    })
  }

  return { queryParams, handleUpdateQuery }
}
