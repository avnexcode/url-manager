import { capitalizeSentence } from '@/utils'
import { m } from '@/generated/paraglide/messages'
import type { TRPC_ERROR_CODE_KEY } from '@trpc/server'
import { TRPCError } from '@trpc/server'
import { AppError } from '../filters'

export class ErrorService {
  static createError(
    statusCode: number,
    status: string,
    message: string,
  ): AppError {
    return new AppError(statusCode, status, message)
  }
}

const ERROR_KEY_MAP: Partial<
  Record<TRPC_ERROR_CODE_KEY, keyof typeof m | string>
> = {
  BAD_REQUEST: 'error_message_trpc_bad_request',
  PARSE_ERROR: 'error_message_trpc_parse_error',
  INTERNAL_SERVER_ERROR: 'error_message_trpc_internal_server_error',
  NOT_IMPLEMENTED: 'error_message_trpc_not_implemented',
  BAD_GATEWAY: 'error_message_trpc_bad_gateway',
  SERVICE_UNAVAILABLE: 'error_message_trpc_service_unavailable',
  GATEWAY_TIMEOUT: 'error_message_trpc_gateway_timeout',
  UNAUTHORIZED: 'error_message_trpc_unauthorized',
  PAYMENT_REQUIRED: 'error_message_trpc_payment_required',
  FORBIDDEN: 'error_message_trpc_forbidden',
  NOT_FOUND: 'error_message_trpc_not_found',
  METHOD_NOT_SUPPORTED: 'error_message_trpc_method_not_supported',
  TIMEOUT: 'error_message_trpc_timeout',
  CONFLICT: 'error_message_trpc_conflict',
  PRECONDITION_FAILED: 'error_message_trpc_precondition_failed',
  PAYLOAD_TOO_LARGE: 'error_message_trpc_payload_too_large',
  UNSUPPORTED_MEDIA_TYPE: 'error_message_trpc_unsupported_media_type',
  UNPROCESSABLE_CONTENT: 'error_message_trpc_unprocessable_content',
  TOO_MANY_REQUESTS: 'error_message_trpc_too_many_requests',
  CLIENT_CLOSED_REQUEST: 'error_message_trpc_client_closed_request',
}

export class ErrorTRPCService extends ErrorService {
  static generateMessage(code: TRPC_ERROR_CODE_KEY, field?: string): string {
    const defaultField = field ?? 'resource'
    const i18nKey =
      ERROR_KEY_MAP[code] ?? 'error_message_trpc_internal_server_error'

    const messageFn = m[i18nKey as keyof typeof m] as (inputs: {
      field: string
    }) => string

    return capitalizeSentence(messageFn({ field: defaultField }))
  }

  static new(
    code: TRPC_ERROR_CODE_KEY,
    message?: string,
    cause?: unknown,
  ): never {
    throw new TRPCError({ code, message, cause })
  }

  static throw(
    code: TRPC_ERROR_CODE_KEY,
    field?: string,
    cause?: unknown,
  ): never {
    throw new TRPCError({
      code,
      message: this.generateMessage(code, field),
      cause,
    })
  }
}
