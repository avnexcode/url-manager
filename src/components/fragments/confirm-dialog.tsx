import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import * as m from '@/generated/paraglide/messages'
import { Loader2 } from 'lucide-react'

export type ConfirmDialogVariant =
  | 'delete'
  | 'verify'
  | 'unverify'
  | 'activate'
  | 'deactivate'
  | 'disburse'
  | 'submit'
  | 'unsubmit'
  | 'require'
  | 'unrequire'
  | 'close'

type VariantMessages = {
  title: (params: { model: string }) => string
  description: (params: { model: string }) => string
  cancelButton: () => string
  confirmButton: () => string
  confirmButtonLoading: () => string
}

type VariantConfig = {
  messages: VariantMessages
  actionVariant?: 'destructive' | 'default'
}

const VARIANT_CONFIG: Record<ConfirmDialogVariant, VariantConfig> = {
  delete: {
    messages: {
      title: m.component_dialog_delete_title,
      description: m.component_dialog_delete_description,
      cancelButton: m.component_dialog_delete_cancel_button,
      confirmButton: m.component_dialog_delete_confirm_button,
      confirmButtonLoading: m.component_dialog_delete_confirm_button_loading,
    },
    actionVariant: 'destructive',
  },
  verify: {
    messages: {
      title: m.component_dialog_verify_title,
      description: m.component_dialog_verify_description,
      cancelButton: m.component_dialog_verify_cancel_button,
      confirmButton: m.component_dialog_verify_confirm_button,
      confirmButtonLoading: m.component_dialog_verify_confirm_button_loading,
    },
    actionVariant: 'default',
  },
  unverify: {
    messages: {
      title: m.component_dialog_unverify_title,
      description: m.component_dialog_unverify_description,
      cancelButton: m.component_dialog_unverify_cancel_button,
      confirmButton: m.component_dialog_unverify_confirm_button,
      confirmButtonLoading: m.component_dialog_unverify_confirm_button_loading,
    },
    actionVariant: 'destructive',
  },
  activate: {
    messages: {
      title: m.component_dialog_activate_title,
      description: m.component_dialog_activate_description,
      cancelButton: m.component_dialog_activate_cancel_button,
      confirmButton: m.component_dialog_activate_confirm_button,
      confirmButtonLoading: m.component_dialog_activate_confirm_button_loading,
    },
    actionVariant: 'default',
  },
  deactivate: {
    messages: {
      title: m.component_dialog_deactivate_title,
      description: m.component_dialog_deactivate_description,
      cancelButton: m.component_dialog_deactivate_cancel_button,
      confirmButton: m.component_dialog_deactivate_confirm_button,
      confirmButtonLoading:
        m.component_dialog_deactivate_confirm_button_loading,
    },
    actionVariant: 'destructive',
  },
  disburse: {
    messages: {
      title: m.component_dialog_disburse_title,
      description: m.component_dialog_disburse_description,
      cancelButton: m.component_dialog_disburse_cancel_button,
      confirmButton: m.component_dialog_disburse_confirm_button,
      confirmButtonLoading: m.component_dialog_disburse_confirm_button_loading,
    },
    actionVariant: 'default',
  },
  submit: {
    messages: {
      title: m.component_dialog_submit_title,
      description: m.component_dialog_submit_description,
      cancelButton: m.component_dialog_submit_cancel_button,
      confirmButton: m.component_dialog_submit_confirm_button,
      confirmButtonLoading: m.component_dialog_submit_confirm_button_loading,
    },
    actionVariant: 'default',
  },
  unsubmit: {
    messages: {
      title: m.component_dialog_unsubmit_title,
      description: m.component_dialog_unsubmit_description,
      cancelButton: m.component_dialog_unsubmit_cancel_button,
      confirmButton: m.component_dialog_unsubmit_confirm_button,
      confirmButtonLoading: m.component_dialog_unsubmit_confirm_button_loading,
    },
    actionVariant: 'destructive',
  },
  require: {
    messages: {
      title: m.component_dialog_require_title,
      description: m.component_dialog_require_description,
      cancelButton: m.component_dialog_require_cancel_button,
      confirmButton: m.component_dialog_require_confirm_button,
      confirmButtonLoading: m.component_dialog_require_confirm_button_loading,
    },
    actionVariant: 'default',
  },
  unrequire: {
    messages: {
      title: m.component_dialog_unrequire_title,
      description: m.component_dialog_unrequire_description,
      cancelButton: m.component_dialog_unrequire_cancel_button,
      confirmButton: m.component_dialog_unrequire_confirm_button,
      confirmButtonLoading: m.component_dialog_unrequire_confirm_button_loading,
    },
    actionVariant: 'destructive',
  },
  close: {
    messages: {
      title: m.component_dialog_close_title,
      description: m.component_dialog_close_description,
      cancelButton: m.component_dialog_close_cancel_button,
      confirmButton: m.component_dialog_close_confirm_button,
      confirmButtonLoading: m.component_dialog_close_confirm_button_loading,
    },
    actionVariant: 'default',
  },
}

type ConfirmDialogProps = {
  variant: ConfirmDialogVariant
  onConfirm: () => void
  isPending: boolean
  onOpenChange: (open: boolean) => void
  open: boolean
  model: string
}

export const ConfirmDialog = ({
  variant,
  onConfirm,
  isPending,
  onOpenChange,
  open,
  model,
}: ConfirmDialogProps) => {
  const { messages, actionVariant = 'default' } = VARIANT_CONFIG[variant]

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-none sm:max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>{messages.title({ model })}</AlertDialogTitle>
          <AlertDialogDescription>
            {messages.description({ model })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="pt-5">
          <AlertDialogAction
            onClick={onConfirm}
            variant={actionVariant}
            className="rounded-none px-10"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin" />
                {messages.confirmButtonLoading()}
              </>
            ) : (
              messages.confirmButton()
            )}
          </AlertDialogAction>
          <AlertDialogCancel className="rounded-none px-10">
            {messages.cancelButton()}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
