import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import * as m from '@/generated/paraglide/messages'
import { CopyTextWrapper } from './elements'
import { Icon } from './icon'
import { Button } from './ui/button'

type QrImageDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  qrCodeUrl: string
  qrEncodedValue?: string
}

export const QrImageDialog = ({
  open,
  onOpenChange,
  title,
  qrCodeUrl,
  qrEncodedValue,
}: QrImageDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="capitalize">{title ?? 'QR Code'}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-8 w-full">
          <div className="w-full max-w-64 overflow-hidden rounded-base border-2 border-border shadow-shadow">
            <img
              src={qrCodeUrl}
              alt={title}
              className="h-auto w-full object-contain"
            />
          </div>

          {qrEncodedValue && (
            <CopyTextWrapper>{qrEncodedValue}</CopyTextWrapper>
          )}

          <a href={qrCodeUrl} download className="w-full">
            <Button
              type="button"
              variant="default"
              size="sm"
              className="w-full gap-2"
            >
              <Icon name="Download" className="size-4" />
              {m.action_download()}
            </Button>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  )
}
