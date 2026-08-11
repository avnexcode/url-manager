'use client'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import * as m from '@/generated/paraglide/messages'
import { cn } from '@/lib/utils'
import { forwardRef } from 'react'
import type { FieldValues, Path } from 'react-hook-form'
import { Controller, useFormContext } from 'react-hook-form'

type InputTextProps<T extends FieldValues> =
  React.ComponentPropsWithoutRef<'input'> & {
    name: Path<T>
    label: string
    required?: boolean
    className?: string
  }

const InputTextInner = <T extends FieldValues>(
  { name, label, required = false, className, ...props }: InputTextProps<T>,
  ref: React.ForwardedRef<HTMLInputElement>,
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
            <Input
              {...field}
              {...props}
              ref={ref}
              id={field.name}
              type={props.type ?? 'text'}
              aria-invalid={fieldState.invalid}
              value={field.value ?? ''}
              placeholder={
                props.placeholder ?? m.form_placeholder_input({ field: label })
              }
              className={cn(className)}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )
      }}
    />
  )
}

type InputTextAs = <T extends FieldValues>(
  props: InputTextProps<T> & { ref?: React.ForwardedRef<HTMLInputElement> },
) => React.ReactElement

export const InputText = forwardRef(InputTextInner) as InputTextAs
