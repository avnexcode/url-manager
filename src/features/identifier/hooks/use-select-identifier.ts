import { useSelectResource } from '@/hooks'
import { useTRPC } from '@/lib/trpc/react'
import { useQuery } from '@tanstack/react-query'
import type { FieldValues, Path } from 'react-hook-form'
import type { IdentifierResponse } from '../types'

export const useSelectIdentifier = <T extends FieldValues>(name: Path<T>) => {
  const trpc = useTRPC()
  return useSelectResource<T, IdentifierResponse>(name, {
    useGetById: (id) =>
      useQuery({
        ...trpc.identifier.getById.queryOptions({ id: id! }),
        enabled: !!id,
        staleTime: Infinity,
      }),
    useGetAll: ({ page, search }) =>
      useQuery(
        trpc.identifier.getAll.queryOptions({
          params: {
            limit: 10,
            page,
            search,
            sort: [{ id: 'title', desc: false }],
          },
        }),
      ),
  })
}
