import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Slider } from '@/components/ui/slider'
import * as m from '@/generated/paraglide/messages'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { useEffect, useRef, useState } from 'react'

type Offset = { x: number; y: number }

type ImageCropDialogProps = {
  open: boolean
  imageSrc: string | null
  fileName: string
  aspect?: number
  outputSize?: number
  onCancel: () => void
  onCropComplete: (file: File) => void
}

const CROP_BOX_WIDTH = 320

export const ImageCropDialog = ({
  open,
  imageSrc,
  fileName,
  aspect = 1,
  outputSize = 512,
  onCancel,
  onCropComplete,
}: ImageCropDialogProps) => {
  const imgRef = useRef<HTMLImageElement>(null)
  const dragState = useRef<{
    pointerX: number
    pointerY: number
    origin: Offset
  } | null>(null)

  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 })
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 })
  const [isProcessing, setIsProcessing] = useState(false)

  const boxWidth = CROP_BOX_WIDTH
  const boxHeight = CROP_BOX_WIDTH / aspect

  // reset saat gambar baru dibuka
  useEffect(() => {
    if (open) {
      setZoom(1)
      setOffset({ x: 0, y: 0 })
      setNaturalSize({ width: 0, height: 0 })
    }
  }, [open, imageSrc])

  const baseScale =
    naturalSize.width && naturalSize.height
      ? Math.max(boxWidth / naturalSize.width, boxHeight / naturalSize.height)
      : 1
  const scale = baseScale * zoom

  const clampOffset = (next: Offset): Offset => {
    const scaledWidth = naturalSize.width * scale
    const scaledHeight = naturalSize.height * scale
    const maxX = Math.max(0, (scaledWidth - boxWidth) / 2)
    const maxY = Math.max(0, (scaledHeight - boxHeight) / 2)
    return {
      x: Math.min(maxX, Math.max(-maxX, next.x)),
      y: Math.min(maxY, Math.max(-maxY, next.y)),
    }
  }

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragState.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      origin: offset,
    }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragState.current) return
    const dx = e.clientX - dragState.current.pointerX
    const dy = e.clientY - dragState.current.pointerY
    setOffset(
      clampOffset({
        x: dragState.current.origin.x + dx,
        y: dragState.current.origin.y + dy,
      }),
    )
  }

  const handlePointerUp = () => {
    dragState.current = null
  }

  const handleZoomChange = (value: number[]) => {
    setZoom(value[0])
    setOffset((prev) => clampOffset(prev))
  }

  const handleImageLoad = () => {
    const img = imgRef.current
    if (!img) return
    setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight })
  }

  const handleConfirm = () => {
    if (!imgRef.current || !naturalSize.width || !naturalSize.height) return
    setIsProcessing(true)

    const canvas = document.createElement('canvas')
    canvas.width = outputSize
    canvas.height = outputSize / aspect

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      setIsProcessing(false)
      return
    }

    const scaledWidth = naturalSize.width * scale
    const scaledHeight = naturalSize.height * scale
    const visibleLeft = (scaledWidth - boxWidth) / 2 - offset.x
    const visibleTop = (scaledHeight - boxHeight) / 2 - offset.y

    ctx.drawImage(
      imgRef.current,
      visibleLeft / scale,
      visibleTop / scale,
      boxWidth / scale,
      boxHeight / scale,
      0,
      0,
      canvas.width,
      canvas.height,
    )

    canvas.toBlob((blob) => {
      setIsProcessing(false)
      if (!blob) return
      onCropComplete(new File([blob], fileName, { type: 'image/png' }))
    }, 'image/png')
  }

  if (!imageSrc) return null

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onCancel()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{m.form_action_crop_image()}</DialogTitle>
        </DialogHeader>

        <div
          className="relative mx-auto touch-none overflow-hidden border-2 border-border bg-muted"
          style={{ width: boxWidth, height: boxHeight }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <img
            ref={imgRef}
            src={imageSrc}
            alt="crop-preview"
            draggable={false}
            onLoad={handleImageLoad}
            className="pointer-events-none absolute top-1/2 left-1/2 max-w-none select-none"
            style={{
              width: naturalSize.width * scale || undefined,
              height: naturalSize.height * scale || undefined,
              transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px)`,
            }}
          />
        </div>

        <div className="flex items-center gap-3 px-1">
          <span className="text-xs text-muted-foreground min-w-fit">
            {m.form_action_zoom()}
          </span>
          <Slider
            min={1}
            max={3}
            step={0.01}
            value={[zoom]}
            onValueChange={handleZoomChange}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="neutral" onClick={onCancel}>
            {m.form_action_cancel()}
          </Button>
          <Button type="button" onClick={handleConfirm} disabled={isProcessing}>
            {m.action_submit()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
