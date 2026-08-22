import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import * as m from '@/generated/paraglide/messages'
import { cn } from '@/lib/utils'
import { forwardRef, useState } from 'react'
import type { FieldValues, Path } from 'react-hook-form'
import { Controller, useFormContext } from 'react-hook-form'
import { TogglePasswordVisibility } from '../elements/toggle-password-visibility'

type InputPasswordProps<T extends FieldValues> = Omit<
  React.ComponentPropsWithoutRef<'input'>,
  'type'
> & {
  name: Path<T>
  label: string
  required?: boolean
  className?: string
}

const InputPasswordInner = <T extends FieldValues>(
  { name, label, required = false, className, ...props }: InputPasswordProps<T>,
  ref: React.ForwardedRef<HTMLInputElement>,
) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)
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
            <div className="relative">
              <Input
                {...field}
                {...props}
                ref={ref}
                id={field.name}
                type={isPasswordVisible ? 'text' : 'password'}
                aria-invalid={fieldState.invalid}
                value={field.value ?? ''}
                placeholder={
                  props.placeholder ??
                  m.form_placeholder_input({ field: label })
                }
                className={cn(className)}
              />
              <TogglePasswordVisibility
                isVisible={isPasswordVisible}
                setIsVisible={setIsPasswordVisible}
              />
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )
      }}
    />
  )
}

type InputPasswordAs = <T extends FieldValues>(
  props: InputPasswordProps<T> & { ref?: React.ForwardedRef<HTMLInputElement> },
) => React.ReactElement

export const InputPassword = forwardRef(InputPasswordInner) as InputPasswordAs
