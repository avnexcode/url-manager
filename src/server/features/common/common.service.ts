import * as m from '@/generated/paraglide/messages'
import type { Trend } from '@/server/models'
import { ErrorTRPCService } from '@/server/services'
import type { TRPC_ERROR_CODE_KEY } from '@trpc/server'

export abstract class CommonService {
  protected static get baseModel(): string {
    return 'resource'
  }

  protected static m<TKey extends keyof typeof m>(
    key: TKey,
    ...args: Parameters<Extract<(typeof m)[TKey], (...args: any) => any>>
  ): ReturnType<Extract<(typeof m)[TKey], (...args: any) => any>> {
    const messageFn = m[key] as (...params: unknown[]) => string
    return messageFn(...args) as ReturnType<
      Extract<(typeof m)[TKey], (...args: any) => any>
    >
  }

  protected static newError(opts: {
    code: TRPC_ERROR_CODE_KEY
    message?: string
    cause?: unknown
  }): never {
    const { code, message, cause } = opts
    return ErrorTRPCService.new(code, message, cause)
  }

  protected static throwError(
    code: TRPC_ERROR_CODE_KEY,
    customModel?: string,
  ): never {
    const field = customModel ?? this.baseModel
    return ErrorTRPCService.throw(code, field)
  }

  protected static checkExists(
    condition: boolean,
    code: TRPC_ERROR_CODE_KEY = 'NOT_FOUND',
    customModel?: string,
  ): void {
    if (condition) this.throwError(code, customModel)
  }

  protected static checkNotNull<T>(
    value: T | null | undefined,
    code: TRPC_ERROR_CODE_KEY = 'NOT_FOUND',
    customModel?: string,
  ): T {
    const isNullish = value === null || value === undefined
    if (isNullish) this.throwError(code, customModel)
    return value
  }

  protected static getMonthRange(monthOffset: number): {
    firstDay: Date
    lastDay: Date
  } {
    const today = new Date()

    const firstDay = new Date(
      today.getFullYear(),
      today.getMonth() + monthOffset,
      1,
    )

    const lastDay = new Date(
      today.getFullYear(),
      today.getMonth() + monthOffset + 1,
      0,
    )
    return { firstDay, lastDay }
  }

  protected static getTrend(month: { previous: number; current: number }): {
    percentage: number
    trend: Trend
  } {
    const { previous, current } = month

    if (previous === 0) {
      const percentage = current > 0 ? 100 : 0

      const trend = current > 0 ? 'increase' : 'same'

      return { percentage, trend }
    }

    const percentage = ((current - previous) / previous) * 100

    const trend =
      percentage > 0 ? 'increase' : percentage < 0 ? 'decrease' : 'same'

    return { percentage: Number(percentage.toFixed(2)), trend }
  }
}
