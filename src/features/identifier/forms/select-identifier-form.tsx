import { SelectPagination, SelectSearch } from '@/components/forms'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import * as m from '@/generated/paraglide/messages'
import { cn } from '@/lib/utils'
import { capitalizeWords } from '@/utils'
import { renderElements } from '@/utils/render-elements'
import { Loader2 } from 'lucide-react'
import type { FieldValues, Path } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import type { useSelectIdentifier } from '../hooks'

type UseSelectIdentifierReturn<T extends FieldValues> = ReturnType<
  typeof useSelectIdentifier<T>
>

type SelectIdentifierFormProps<T extends FieldValues> = {
  name: Path<T>
  label: string
  required?: boolean
  className?: string
  hookProps: UseSelectIdentifierReturn<T>
}

export const SelectIdentifierForm = <T extends FieldValues>({
  name,
  label,
  required = false,
  className,
  hookProps,
}: SelectIdentifierFormProps<T>) => {
  const {
    page,
    selectedItem,
    isReady,
    totalPages,
    searchTerm,
    isItemsLoading,
    form,
    combinedItems,
    handlePageChange,
    handleSearchChange,
    handleSearchInputClick,
    isSelectedLoading,
  } = hookProps

  if (!isReady) {
    return (
      <div className="w-full space-y-4">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-9 w-full" />
      </div>
    )
  }

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
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
            value={field.value ?? ''}
            defaultValue={field.value}
          >
            <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
              <SelectValue
                placeholder={m.form_placeholder_select({ field: label })}
              >
                {capitalizeWords(selectedItem?.title ?? '') ||
                  m.form_placeholder_select({ field: label })}
              </SelectValue>
            </SelectTrigger>
            <SelectContent
              position="popper"
              className="w-(--radix-select-trigger-width)"
            >
              <SelectSearch
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                onClick={handleSearchInputClick}
              />

              {isItemsLoading || isSelectedLoading ? (
                <div className="flex justify-center py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                <>
                  {renderElements({
                    of: combinedItems,
                    keyExtractor: (item) => item.id,
                    render: (item) => (
                      <SelectItem value={item.id} className="capitalize">
                        {item.title}
                      </SelectItem>
                    ),
                    fallback: (
                      <SelectItem value="none" disabled>
                        {m.form_validation_empty_state()}
                      </SelectItem>
                    ),
                  })}

                  <SelectPagination
                    currentPage={page}
                    totalPages={totalPages}
                    isLoading={isItemsLoading}
                    onPageChange={handlePageChange}
                  />
                </>
              )}
            </SelectContent>
          </Select>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
