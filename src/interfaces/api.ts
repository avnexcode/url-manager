import type { LinkProps } from '@tanstack/react-router'

export interface QueryResponse<T> {
  data: T[]
  meta: { total: number; limit: number; page: number; lastPage: number }
}

export interface UseMutationOptions {
  redirect?: boolean
  redirectTo?: LinkProps['to']
  onSuccess?: () => void
  onError?: () => void
}
