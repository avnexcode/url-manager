import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import * as m from '@/generated/paraglide/messages'
import { Download, ExternalLink } from 'lucide-react'
import { CopyTextWrapper } from './elements'
import { Button } from './ui/button'
import { handleDownload } from '@/lib/supabase/image-download'

const ensureAbsoluteUrl = (value: string) => {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`
}

type QrImageDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  qrCodeUrl?: string
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
      <DialogContent className="sm:max-w-xl" variant={'default'}>
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
            <div className="flex w-full flex-col items-center gap-2">
              <CopyTextWrapper>{qrEncodedValue}</CopyTextWrapper>
              <a
                href={ensureAbsoluteUrl(qrEncodedValue)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
              >
                <ExternalLink className="size-3.5" />
                {m.action_visit()}
              </a>
            </div>
          )}

          <Button
            type="button"
            variant="default"
            size="sm"
            className="w-full gap-2"
            onClick={() => handleDownload(qrCodeUrl)}
          >
            <Download className="size-4" />
            {m.action_download()}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
