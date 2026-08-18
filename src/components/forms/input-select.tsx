import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import * as m from '@/generated/paraglide/messages'
import { cn } from '@/lib/utils'
import { renderElements } from '@/utils'
import type { FieldValues, Path, PathValue } from 'react-hook-form'
import { Controller, useFormContext } from 'react-hook-form'

type SelectOption<T extends FieldValues, TName extends Path<T>> = {
  label: string
  value: PathValue<T, TName>
}

type InputSelectProps<T extends FieldValues, TName extends Path<T>> = {
  name: TName
  label: string
  required?: boolean
  options: string[] | SelectOption<T, TName>[]
  className?: string
}

const normalizeOptions = <T extends FieldValues, TName extends Path<T>>(
  options: string[] | SelectOption<T, TName>[],
): SelectOption<T, TName>[] => {
  return options.map((opt) => {
    return typeof opt === 'string'
      ? ({ label: opt, value: opt } as SelectOption<T, TName>)
      : opt
  })
}

export const InputSelect = <T extends FieldValues, TName extends Path<T>>({
  name,
  label,
  required = false,
  className,
  options,
}: InputSelectProps<T, TName>) => {
  const form = useFormContext<T>()

  const normalizedOptions = normalizeOptions<T, TName>(options)

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => {
        const isValidValue =
          field.value !== undefined &&
          field.value !== null &&
          field.value !== '' &&
          normalizedOptions.some(
            (opt) => String(opt.value) === String(field.value),
          )

        const selectValue = isValidValue ? field.value : undefined

        return (
          <Field
            data-invalid={fieldState.invalid}
            className={cn('w-full', className)}
          >
            <FieldLabel htmlFor={field.name} className="capitalize">
              {label}
              {required && <span className="text-destructive">*</span>}
            </FieldLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={selectValue}
              value={selectValue}
            >
              <SelectTrigger
                id={field.name}
                aria-invalid={fieldState.invalid}
                className="capitalize"
              >
                <SelectValue
                  placeholder={m.form_placeholder_select({
                    field: label,
                  })}
                />
              </SelectTrigger>
              <SelectContent className="w-(--radix-select-trigger-width)">
                {renderElements({
                  of: normalizedOptions,
                  keyExtractor: (option, index) => `${option.value}-${index}`,
                  render: (option) => (
                    <SelectItem
                      value={String(option.value)}
                      className="capitalize"
                    >
                      {option.label}
                    </SelectItem>
                  ),
                })}
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )
      }}
    />
  )
}
