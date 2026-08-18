import { useNavigate, useSearch } from '@tanstack/react-router'
import z from 'zod'

const sortItemSchema = z.object({
  id: z.string(),
  desc: z.boolean(),
})

export const searchSchema = z.object({
  search: z.string().default(''),
  page: z.number().int().default(1),
  sort: z.array(sortItemSchema).default([{ id: 'createdAt', desc: true }]),
  limit: z.number().int().default(15),
})

export type SearchParams = z.infer<typeof searchSchema>

export const useQueryParams = () => {
  const params = useSearch({ strict: false })
  const queryParams = searchSchema.parse(params)
  const navigate = useNavigate()

  const handleUpdateQuery = (newParams: Partial<SearchParams>) => {
    void navigate({
      search: ((prev: SearchParams) => ({
        ...prev,
        ...newParams,
      })) as unknown as true,
      replace: true,
    })
  }

  return { queryParams, handleUpdateQuery }
}
