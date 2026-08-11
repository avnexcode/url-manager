import { capitalizeSentence, toSnakeCase } from '@/utils'
import { toast } from 'sonner'
import * as m from '@/generated/paraglide/messages'

export type ToastAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'save'
  | 'upload'
  | 'activate'
  | 'deactivate'
  | 'complete'
  | 'incomplete'
  | 'verify'
  | 'unverify'
  | 'require'
  | 'unrequire'
  | 'enable'
  | 'disable'
  | 'publish'
  | 'unpublish'
  | 'approve'
  | 'unapprove'
  | 'lock'
  | 'unlock'
  | 'archive'
  | 'unarchive'
  | 'pin'
  | 'unpin'
  | 'feature'
  | 'unfeature'
  | 'expire'
  | 'unexpire'
  | 'cancel'
  | 'uncancel'
  | 'pay'
  | 'unpay'
  | 'confirm'
  | 'unconfirm'
  | 'subscribe'
  | 'unsubscribe'
  | 'process'
  | 'unprocess'
  | 'sync'
  | 'unsync'
  | 'import'
  | 'export'
  | 'generate'
  | 'convert'
  | 'read'
  | 'unread'
  | 'show'
  | 'hide'
  | 'setDefault'
  | 'unsetDefault'
  | 'setPrimary'
  | 'unsetPrimary'
  | 'register'
  | 'login'
  | 'logout'

const inverseAction: Partial<Record<ToastAction, ToastAction>> = {
  activate: 'deactivate',
  complete: 'incomplete',
  verify: 'unverify',
  require: 'unrequire',
  enable: 'disable',
  publish: 'unpublish',
  approve: 'unapprove',
  lock: 'unlock',
  archive: 'unarchive',
  pin: 'unpin',
  feature: 'unfeature',
  expire: 'unexpire',
  cancel: 'uncancel',
  pay: 'unpay',
  confirm: 'unconfirm',
  subscribe: 'unsubscribe',
  process: 'unprocess',
  sync: 'unsync',
  read: 'unread',
  show: 'hide',
  setDefault: 'unsetDefault',
  setPrimary: 'unsetPrimary',
}

type ToastMessageFn = (params: { field: string }) => string
const toastMessages = m as unknown as Record<string, ToastMessageFn>

export const useToastMessages = (field: string) => {
  const success = (action: ToastAction) => {
    const key = `success_message_${toSnakeCase(action)}`
    return toast.success(capitalizeSentence(toastMessages[key]({ field })))
  }

  const error = (action: ToastAction, message?: string) => {
    const key = `error_message_${toSnakeCase(action)}`
    return toast.error(
      message || capitalizeSentence(toastMessages[key]({ field })),
    )
  }

  const makeHandlers = (action: ToastAction) => ({
    onSuccess: () => success(action),
    onError: (err: { message: string }) => error(action, err.message),
  })

  const onToggle = (action: ToastAction, value: boolean) => {
    const resolvedAction = value ? action : (inverseAction[action] ?? action)
    return makeHandlers(resolvedAction)
  }

  return {
    onCreate: makeHandlers('create'),
    onUpdate: makeHandlers('update'),
    onDelete: makeHandlers('delete'),
    onSave: makeHandlers('save'),
    onUpload: makeHandlers('upload'),
    onLogin: makeHandlers('login'),
    onRegister: makeHandlers('register'),
    onLogout: makeHandlers('logout'),

    onToggle,

    onActivate: (value: boolean) => onToggle('activate', value),
    onComplete: (value: boolean) => onToggle('complete', value),
    onVerify: (value: boolean) => onToggle('verify', value),
    onEnable: (value: boolean) => onToggle('enable', value),
    onPublish: (value: boolean) => onToggle('publish', value),
    onApprove: (value: boolean) => onToggle('approve', value),
    onLock: (value: boolean) => onToggle('lock', value),
    onArchive: (value: boolean) => onToggle('archive', value),
    onPin: (value: boolean) => onToggle('pin', value),
    onFeature: (value: boolean) => onToggle('feature', value),
    onExpire: (value: boolean) => onToggle('expire', value),
    onCancel: (value: boolean) => onToggle('cancel', value),
    onPay: (value: boolean) => onToggle('pay', value),
    onConfirm: (value: boolean) => onToggle('confirm', value),
    onSubscribe: (value: boolean) => onToggle('subscribe', value),
    onProcess: (value: boolean) => onToggle('process', value),
    onSync: (value: boolean) => onToggle('sync', value),
    onRead: (value: boolean) => onToggle('read', value),
    onShow: (value: boolean) => onToggle('show', value),
    onSetDefault: (value: boolean) => onToggle('setDefault', value),
    onSetPrimary: (value: boolean) => onToggle('setPrimary', value),
    onRequire: (value: boolean) => onToggle('require', value),

    onImport: makeHandlers('import'),
    onExport: makeHandlers('export'),
    onGenerate: makeHandlers('generate'),
    onConvert: makeHandlers('convert'),
  }
}
