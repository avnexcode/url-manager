export interface QueryResponse<T> {
  data: T[];
  meta: {
    total: number;
    limit: number;
    page: number;
    lastPage: number;
  };
}

