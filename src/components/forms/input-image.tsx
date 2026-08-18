import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import * as m from '@/generated/paraglide/messages'
import { cn } from '@/lib/utils'
import { ImageOff } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { FieldValues, Path } from 'react-hook-form'
import { Controller, useFormContext } from 'react-hook-form'
import { Skeleton } from '../ui/skeleton'

type InputImageprops<T extends FieldValues> = {
  name: Path<T>
  label: string
  required?: boolean
  className?: string
  image?: string | null
  defaultImage?: string
}

export const InputImage = <T extends FieldValues>({
  name,
  label,
  required = false,
  className,
  image,
  defaultImage,
}: InputImageprops<T>) => {
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

          <div className="relative mt-2 max-h-100 w-full max-w-2xl overflow-x-hidden overflow-y-auto rounded-base border-2 border-border shadow-shadow">
            {previewSrc ? (
              <img
                src={previewSrc}
                alt="image-preview"
                className="h-auto w-full object-contain"
              />
            ) : (
              <button
                type="button"
                onClick={handleOpenFileExplorer}
                className="flex h-52 w-full flex-col items-center justify-center gap-2 bg-muted text-muted-foreground transition-colors hover:bg-muted/70"
              >
                <ImageOff size={32} />
                <span className="text-xs">{m.form_action_choose_file()}</span>
              </button>
            )}
          </div>

          <div className="ml-auto flex max-w-fit items-center gap-2 md:ml-0">
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleOpenFileExplorer}
              className="h-7 px-3 text-xs"
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
                className="h-7 px-3 text-xs"
              >
                {m.form_action_remove_file()}
              </Button>
            )}
          </div>

          <input
            id={field.name}
            type="file"
            accept="image/*"
            ref={inputFileRef}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              field.onChange(file)
            }}
          />

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}

type InputImageSkeletonProps = {
  withRemoveButton?: boolean
}

export const InputImageSkeleton = ({
  withRemoveButton = false,
}: InputImageSkeletonProps = {}) => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-5 w-44" />
      <Skeleton className="h-100 w-full max-w-2xl rounded-base" />
      <div className="flex gap-2">
        <Skeleton className="h-9 w-32" />
        {withRemoveButton && <Skeleton className="h-9 w-32" />}
      </div>
    </div>
  )
}
