import type { buttonVariants } from '@/components/ui/button'
import { Button } from '@/components/ui/button'
import * as m from '@/generated/paraglide/messages'
import { cn } from '@/lib/utils'
import type { VariantProps } from 'class-variance-authority'
import { icons, Loader2 } from 'lucide-react'
import { forwardRef } from 'react'

export type ActionVariant =
  | 'addNew'
  | 'createNew'
  | 'detail'
  | 'visit'
  | 'edit'
  | 'delete'
  | 'submit'
  | 'approve'
  | 'cancel'
  | 'close'
  | 'disburse'
  | 'verify'
  | 'complete'
  | 'enable'
  | 'disable'
  | 'publish'
  | 'unpublish'
  | 'lock'
  | 'unlock'
  | 'archive'
  | 'unarchive'
  | 'pin'
  | 'unpin'
  | 'feature'
  | 'unfeature'
  | 'upload'
  | 'download'
  | 'process'
  | 'generate'
  | 'convert'
  | 'sync'
  | 'import'
  | 'export'
  | 'reject'
  | 'activate'
  | 'unverify'
  | 'unsubmit'
  | 'require'
  | 'unrequire'
  | 'deactivate'

type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>
type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>

type ActionVariantConfig = {
  buttonVariant: ButtonVariant
  defaultIcon?: keyof typeof icons
  label: () => string
}

export const ACTION_VARIANT_CONFIG: Record<ActionVariant, ActionVariantConfig> =
  {
    addNew: {
      buttonVariant: 'default',
      defaultIcon: 'CirclePlus',
      label: m.action_add_new,
    },
    createNew: {
      buttonVariant: 'default',
      defaultIcon: 'Plus',
      label: m.action_create_new,
    },
    detail: {
      buttonVariant: 'neutral',
      defaultIcon: 'ScanEye',
      label: m.action_detail,
    },
    visit: {
      buttonVariant: 'neutral',
      defaultIcon: 'Link',
      label: m.action_visit,
    },
    edit: {
      buttonVariant: 'neutral',
      defaultIcon: 'SquarePen',
      label: m.action_edit,
    },
    delete: {
      buttonVariant: 'destructive',
      defaultIcon: 'Trash2',
      label: m.action_delete,
    },
    submit: {
      buttonVariant: 'default',
      defaultIcon: 'Send',
      label: m.action_submit,
    },
    unsubmit: {
      buttonVariant: 'destructive',
      defaultIcon: 'X',
      label: m.action_unsubmit,
    },
    require: {
      buttonVariant: 'default',
      defaultIcon: 'Check',
      label: m.action_require,
    },
    unrequire: {
      buttonVariant: 'destructive',
      defaultIcon: 'X',
      label: m.action_unrequire,
    },
    approve: {
      buttonVariant: 'default',
      defaultIcon: 'CircleCheck',
      label: m.action_approve,
    },
    cancel: {
      buttonVariant: 'outline',
      defaultIcon: 'X',
      label: m.action_cancel,
    },
    close: {
      buttonVariant: 'default',
      defaultIcon: 'CopyX',
      label: m.action_close,
    },
    disburse: {
      buttonVariant: 'default',
      defaultIcon: 'DollarSign',
      label: m.action_disburse,
    },
    verify: {
      buttonVariant: 'default',
      defaultIcon: 'ShieldCheck',
      label: m.action_verify,
    },
    unverify: {
      buttonVariant: 'destructive',
      defaultIcon: 'ShieldX',
      label: m.action_unverify,
    },
    activate: {
      buttonVariant: 'default',
      defaultIcon: 'CircleCheck',
      label: m.action_activate,
    },
    deactivate: {
      buttonVariant: 'destructive',
      defaultIcon: 'CircleX',
      label: m.action_deactivate,
    },
    complete: {
      buttonVariant: 'default',
      defaultIcon: 'CircleCheckBig',
      label: m.action_complete,
    },
    enable: {
      buttonVariant: 'default',
      defaultIcon: 'ToggleRight',
      label: m.action_enable,
    },
    disable: {
      buttonVariant: 'destructive',
      defaultIcon: 'ToggleLeft',
      label: m.action_disable,
    },
    publish: {
      buttonVariant: 'default',
      defaultIcon: 'Globe',
      label: m.action_publish,
    },
    unpublish: {
      buttonVariant: 'destructive',
      defaultIcon: 'GlobeLock',
      label: m.action_unpublish,
    },
    lock: {
      buttonVariant: 'destructive',
      defaultIcon: 'Lock',
      label: m.action_lock,
    },
    unlock: {
      buttonVariant: 'default',
      defaultIcon: 'LockOpen',
      label: m.action_unlock,
    },
    archive: {
      buttonVariant: 'destructive',
      defaultIcon: 'Archive',
      label: m.action_archive,
    },
    unarchive: {
      buttonVariant: 'default',
      defaultIcon: 'ArchiveRestore',
      label: m.action_unarchive,
    },
    pin: {
      buttonVariant: 'default',
      defaultIcon: 'Pin',
      label: m.action_pin,
    },
    unpin: {
      buttonVariant: 'outline',
      defaultIcon: 'PinOff',
      label: m.action_unpin,
    },
    feature: {
      buttonVariant: 'default',
      defaultIcon: 'Star',
      label: m.action_feature,
    },
    unfeature: {
      buttonVariant: 'outline',
      defaultIcon: 'StarOff',
      label: m.action_unfeature,
    },
    upload: {
      buttonVariant: 'default',
      defaultIcon: 'Upload',
      label: m.action_upload,
    },
    download: {
      buttonVariant: 'outline',
      defaultIcon: 'Download',
      label: m.action_download,
    },
    process: {
      buttonVariant: 'default',
      defaultIcon: 'RefreshCw',
      label: m.action_process,
    },
    generate: {
      buttonVariant: 'default',
      defaultIcon: 'Sparkles',
      label: m.action_generate,
    },
    convert: {
      buttonVariant: 'default',
      defaultIcon: 'ArrowRightLeft',
      label: m.action_convert,
    },
    sync: {
      buttonVariant: 'outline',
      defaultIcon: 'RefreshCcw',
      label: m.action_sync,
    },
    import: {
      buttonVariant: 'default',
      defaultIcon: 'LogIn',
      label: m.action_import,
    },
    export: {
      buttonVariant: 'outline',
      defaultIcon: 'LogOut',
      label: m.action_export,
    },
    reject: {
      buttonVariant: 'destructive',
      defaultIcon: 'CircleX',
      label: m.action_reject,
    },
  }

type ActionButtonProps = Omit<React.ComponentProps<'button'>, 'children'> & {
  action: ActionVariant
  isPending?: boolean
  size?: ButtonSize
  hideLabel?: boolean
  children?: React.ReactNode
}

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  (
    {
      action,
      isPending = false,
      disabled,
      size = 'default',
      hideLabel = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const { buttonVariant, defaultIcon, label } = ACTION_VARIANT_CONFIG[action]

    const IconComp = defaultIcon ? icons[defaultIcon] : null
    const labelText = label()

    const smHideLabel = action === 'download'

    const content = children ?? (
      <>
        {IconComp && (
          <IconComp
            className={cn('h-3.5 w-3.5', !hideLabel && 'mr-1.5 sm:mr-0')}
          />
        )}
        {!hideLabel && (
          <span className={cn(smHideLabel && 'sm:hidden')}>{labelText}</span>
        )}
      </>
    )

    return (
      <Button
        ref={ref}
        variant={buttonVariant}
        size={size}
        disabled={disabled || isPending}
        className={cn('rounded-none capitalize', className)}
        {...props}
      >
        {isPending ? (
          <>
            <Loader2 className="animate-spin" />
            {!hideLabel && (
              <span className={cn(smHideLabel && 'sm:hidden')}>
                {labelText}
              </span>
            )}
          </>
        ) : (
          content
        )}
      </Button>
    )
  },
)

ActionButton.displayName = 'ActionButton'
