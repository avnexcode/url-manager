'use client'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import * as m from '@/generated/paraglide/messages'
import { cn } from '@/lib/utils'
import { forwardRef } from 'react'
import type { FieldValues, Path } from 'react-hook-form'
import { Controller, useFormContext } from 'react-hook-form'
import { Textarea } from '../ui/textarea'

type InputTextAreaProps<T extends FieldValues> =
  React.ComponentPropsWithoutRef<'textarea'> & {
    name: Path<T>
    label: string
    required?: boolean
    className?: string
  }

const InputTextAreaInner = <T extends FieldValues>(
  { name, label, required = false, className, ...props }: InputTextAreaProps<T>,
  ref: React.ForwardedRef<HTMLTextAreaElement>,
) => {
  const form = useFormContext<T>()

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => {
        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name} className="capitalize">
              {label}
              {required && <span className="text-destructive">*</span>}
            </FieldLabel>
            <Textarea
              {...field}
              {...props}
              ref={ref}
              id={field.name}
              aria-invalid={fieldState.invalid}
              value={field.value ?? ''}
              placeholder={
                props.placeholder ?? m.form_placeholder_input({ field: label })
              }
              className={cn('min-h-30', className)}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )
      }}
    />
  )
}

type InputTextAreaAs = <T extends FieldValues>(
  props: InputTextAreaProps<T> & {
    ref?: React.ForwardedRef<HTMLTextAreaElement>
  },
) => React.ReactElement

export const InputTextArea = forwardRef(InputTextAreaInner) as InputTextAreaAs
