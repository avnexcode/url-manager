import { useSelectResource } from '@/hooks'
import { useTRPC } from '@/lib/trpc/react'
import { useQuery } from '@tanstack/react-query'
import type { FieldValues, Path } from 'react-hook-form'
import type { PlatformResponse } from '../types'

export const useSelectPlatform = <T extends FieldValues>(name: Path<T>) => {
  const trpc = useTRPC()

  return useSelectResource<T, PlatformResponse>(name, {
    useGetById: (id) =>
      useQuery({
        ...trpc.platform.getById.queryOptions({ id: id! }),
        enabled: !!id,
        staleTime: Infinity,
      }),
    useGetAll: ({ page, search }) =>
      useQuery(
        trpc.platform.getAll.queryOptions({
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
