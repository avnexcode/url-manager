import { ImageCropDialog } from '@/components/fragments'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import * as m from '@/generated/paraglide/messages'
import { cn } from '@/lib/utils'
import { ImageOff } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { FieldValues, Path } from 'react-hook-form'
import { Controller, useFormContext } from 'react-hook-form'
import { Skeleton } from '../ui/skeleton'

type InputAvatarprops<T extends FieldValues> = {
  name: Path<T>
  label: string
  required?: boolean
  className?: string
  image?: string | null
  defaultImage?: string
  cropEnabled?: boolean
}

export const InputAvatar = <T extends FieldValues>({
  name,
  label,
  required = false,
  className,
  image,
  defaultImage,
  cropEnabled = true,
}: InputAvatarprops<T>) => {
  const form = useFormContext<T>()
  const inputFileRef = useRef<HTMLInputElement>(null)

  const handleOpenFileExplorer = () => {
    inputFileRef.current?.click()
  }

  const selectedImage = form.watch(name)
  const [selectedImagePreview, setSelectedImagePreview] = useState<
    string | null
  >(null)

  useEffect(() => {
    if (!selectedImage) {
      setSelectedImagePreview(null)
      return
    }

    const objectUrl = URL.createObjectURL(selectedImage)
    setSelectedImagePreview(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [selectedImage])

  const previewSrc = selectedImagePreview ?? image ?? defaultImage ?? null

  // state khusus untuk alur crop (gambar mentah sebelum dipotong)
  const [pendingRawSrc, setPendingRawSrc] = useState<string | null>(null)
  const [pendingFileName, setPendingFileName] = useState('')
  const [cropDialogOpen, setCropDialogOpen] = useState(false)

  const cleanupPendingRawSrc = () => {
    if (pendingRawSrc) URL.revokeObjectURL(pendingRawSrc)
    setPendingRawSrc(null)
  }

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={cn(className)}>
          <FieldLabel htmlFor={field.name} className="capitalize">
            {label}
            {required && <span className="text-destructive">*</span>}
          </FieldLabel>

          {/* Preview Gambar */}
          <div className="aspect-square w-full overflow-hidden bg-muted">
            {previewSrc ? (
              <img
                src={previewSrc}
                alt="image-preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <button
                type="button"
                onClick={handleOpenFileExplorer}
                className="flex h-full w-full flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:bg-muted/70"
              >
                <ImageOff size={28} />
              </button>
            )}
          </div>

          {/* Tombol Pilih/Ganti File */}
          <div className="flex flex-col items-center justify-center gap-2">
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleOpenFileExplorer}
              className="px-10"
            >
              {selectedImage
                ? m.form_action_change_file()
                : m.form_action_choose_file()}
            </Button>

            {selectedImage && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => form.resetField(name)}
                className="px-10"
              >
                {m.form_action_remove_file()}
              </Button>
            )}
          </div>

          {/* Input File Tersembunyi */}
          <input
            id={field.name}
            type="file"
            accept="image/*"
            ref={inputFileRef}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (!file) return

              if (!cropEnabled) {
                field.onChange(file)
                return
              }

              const objectUrl = URL.createObjectURL(file)
              setPendingRawSrc(objectUrl)
              setPendingFileName(file.name)
              setCropDialogOpen(true)

              // reset value agar file yang sama bisa dipilih ulang setelah cancel
              e.target.value = ''
            }}
          />

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}

          <ImageCropDialog
            open={cropDialogOpen}
            imageSrc={pendingRawSrc}
            fileName={pendingFileName}
            aspect={1}
            onCancel={() => {
              setCropDialogOpen(false)
              cleanupPendingRawSrc()
            }}
            onCropComplete={(croppedFile) => {
              field.onChange(croppedFile)
              setCropDialogOpen(false)
              cleanupPendingRawSrc()
            }}
          />
        </Field>
      )}
    />
  )
}

type InputAvatarSkeletonProps = {
  withRemoveButton?: boolean
}

export const InputAvatarSkeleton = ({
  withRemoveButton = false,
}: InputAvatarSkeletonProps = {}) => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-5 w-20" />
      <Skeleton className="aspect-square w-full rounded-full" />
      <div className="flex flex-col items-center justify-center gap-2">
        <Skeleton className="h-9 w-32" />
        {withRemoveButton && <Skeleton className="h-9 w-32" />}
      </div>
    </div>
  )
}
