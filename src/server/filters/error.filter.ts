import type { TRPC_ERROR_CODE_KEY } from '@trpc/server'
import { TRPCError } from '@trpc/server'
import { ZodError } from 'zod'
import { ErrorTRPCService } from '../services'

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public status: string,
    public message: string,
  ) {
    super(message)
  }
}

export const errorFilter = (error: unknown) => {
  if (error instanceof TRPCError) {
    throw error
  }

  if (error instanceof ZodError) {
    const zodMessage = error.issues.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }))

    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: ErrorTRPCService.generateMessage('BAD_REQUEST', 'validation'),
      cause: zodMessage,
    })
  }

  if (error instanceof AppError) {
    const errorCodeMap: Record<number, TRPC_ERROR_CODE_KEY> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      402: 'PAYMENT_REQUIRED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      405: 'METHOD_NOT_SUPPORTED',
      408: 'TIMEOUT',
      409: 'CONFLICT',
      412: 'PRECONDITION_FAILED',
      413: 'PAYLOAD_TOO_LARGE',
      415: 'UNSUPPORTED_MEDIA_TYPE',
      422: 'UNPROCESSABLE_CONTENT',
      429: 'TOO_MANY_REQUESTS',
      499: 'CLIENT_CLOSED_REQUEST',
      500: 'INTERNAL_SERVER_ERROR',
      501: 'NOT_IMPLEMENTED',
      502: 'BAD_GATEWAY',
      503: 'SERVICE_UNAVAILABLE',
      504: 'GATEWAY_TIMEOUT',
    }

    const code = errorCodeMap[error.statusCode] ?? 'INTERNAL_SERVER_ERROR'

    throw new TRPCError({
      code,
      message: error.message,
      cause: error,
    })
  }

  if (error instanceof Error) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message:
        error.message ||
        ErrorTRPCService.generateMessage('INTERNAL_SERVER_ERROR'),
      cause: error,
    })
  }

  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: ErrorTRPCService.generateMessage('INTERNAL_SERVER_ERROR'),
    cause: error,
  })
}

