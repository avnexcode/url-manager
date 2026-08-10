import type z from 'zod'
import type { queryParams } from '../validations'

export type QueryParams = z.infer<typeof queryParams>

export type Trend = 'increase' | 'decrease' | 'same'

export type StatsResponse = {
  length: number
  trend: Trend
  percentage: number
}

