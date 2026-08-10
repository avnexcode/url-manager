'use client'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { cn } from '@/lib/utils'
import { forwardRef } from 'react'
import type { FieldValues, Path } from 'react-hook-form'
import { Controller, useFormContext } from 'react-hook-form'
import { Skeleton } from '../ui/skeleton'
import { Textarea } from '../ui/textarea'

type InputTextAreaProps<T extends FieldValues> =
  React.ComponentPropsWithoutRef<'textarea'> & {
    name: Path<T>
    label?: string
    required?: boolean
    className?: string
    textAreaClassName?: string
  }

const InputTextAreaInner = <T extends FieldValues>(
  {
    name,
    label,
    required,
    className,
    textAreaClassName,
    ...textareaProps
  }: InputTextAreaProps<T>,
  ref: React.ForwardedRef<HTMLTextAreaElement>,
) => {
  const form = useFormContext<T>()

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
          <Textarea
            {...field}
            {...textareaProps}
            ref={ref}
            id={field.name}
            aria-invalid={fieldState.invalid}
            value={field.value ?? ''}
            placeholder={textareaProps.placeholder}
            className={cn('min-h-30', textAreaClassName)}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}

export const InputTextArea = forwardRef(InputTextAreaInner) as <
  T extends FieldValues,
>(
  props: InputTextAreaProps<T> & {
    ref?: React.ForwardedRef<HTMLTextAreaElement>
  },
) => React.ReactElement

export const InputTextAreaSkeleton = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-5 w-44" />
      <Skeleton className="h-20 w-full" />
    </div>
  )
}

