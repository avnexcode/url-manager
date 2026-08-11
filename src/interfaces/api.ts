export interface QueryResponse<T> {
  data: T[]
  meta: { total: number; limit: number; page: number; lastPage: number }
}

export interface UseMutationOptions {
  redirect?: boolean
  redirectTo?: string
  onSuccess?: () => void
  onError?: () => void
}
