'use client'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { forwardRef } from 'react'
import type { FieldValues, Path } from 'react-hook-form'
import { Controller, useFormContext } from 'react-hook-form'
import { Skeleton } from '../ui/skeleton'

type InputTextProps<T extends FieldValues> =
  React.ComponentPropsWithoutRef<'input'> & {
    name: Path<T>
    label?: string
    required?: boolean
    className?: string
  }

const InputTextInner = <T extends FieldValues>(
  { name, label, required, className, ...inputProps }: InputTextProps<T>,
  ref: React.ForwardedRef<HTMLInputElement>,
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
          <Input
            {...field}
            {...inputProps}
            ref={ref}
            id={field.name}
            type={inputProps.type ?? 'text'}
            aria-invalid={fieldState.invalid}
            value={field.value ?? ''}
            placeholder={inputProps.placeholder}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}

export const InputText = forwardRef(InputTextInner) as <T extends FieldValues>(
  props: InputTextProps<T> & { ref?: React.ForwardedRef<HTMLInputElement> },
) => React.ReactElement

export const InputTextSkeleton = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-5 w-44" />
      <Skeleton className="h-9 w-full" />
    </div>
  )
}

