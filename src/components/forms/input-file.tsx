import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import * as m from '@/generated/paraglide/messages'
import { cn } from '@/lib/utils'
import { useRef } from 'react'
import type { FieldValues, Path } from 'react-hook-form'
import { Controller, useFormContext } from 'react-hook-form'
import { Skeleton } from '../ui/skeleton'

type InputFileProps<T extends FieldValues> = {
  name: Path<T>
  label: string
  required?: boolean
  className?: string
  accept?: string
  placeholder?: string
}

export const InputFile = <T extends FieldValues>({
  name,
  label,
  required = false,
  className,
  accept = 'image/*',
  placeholder,
}: InputFileProps<T>) => {
  const form = useFormContext<T>()
  const inputFileRef = useRef<HTMLInputElement>(null)

  const handleOpenFileExplorer = () => {
    inputFileRef.current?.click()
  }

  const selectedFile: File | undefined = form.watch(name)
  const fileName = selectedFile?.name ?? ''

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

          <div
            className={cn(
              'border-border bg-secondary-background text-foreground flex h-9 w-full items-center rounded-base border-2 px-3 py-1 text-sm shadow-shadow',
              'cursor-default select-none',
            )}
          >
            <span className="min-w-0 flex-1 truncate">
              {fileName || (placeholder ?? m.form_placeholder_no_file_chosen())}
            </span>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleOpenFileExplorer}
              className="h-7 px-3 text-xs"
            >
              {selectedFile
                ? m.form_action_change_file()
                : m.form_action_choose_file()}
            </Button>

            {selectedFile && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => {
                  form.resetField(name)
                  if (inputFileRef.current) {
                    inputFileRef.current.value = ''
                  }
                }}
                className="h-7 px-3 text-xs"
              >
                {m.form_action_remove_file()}
              </Button>
            )}
          </div>

          <input
            id={field.name}
            type="file"
            accept={accept}
            ref={inputFileRef}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              field.onChange(file ?? null)
            }}
          />

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}

type InputFileSkeletonProps = {
  withRemoveButton?: boolean
}

export const InputFileSkeleton = ({
  withRemoveButton = false,
}: InputFileSkeletonProps = {}) => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-5 w-44" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-full rounded-md" />
        {withRemoveButton && <Skeleton className="h-9 w-32" />}
      </div>
    </div>
  )
}
