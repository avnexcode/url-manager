'use client'
import * as React from 'react'

import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

export const Select = ({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) => {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

export const SelectGroup = ({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) => {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

export const SelectValue = ({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) => {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

export const selectTriggerVariants = cva(
  "flex h-10 w-full items-center justify-between rounded-base border-2 border-border gap-2 px-3 py-2 text-sm font-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-main text-main-foreground',
        noShadow: 'bg-main text-main-foreground',
        neutral: 'bg-secondary text-secondary-foreground',
        neutralNoShadow: 'bg-secondary text-secondary-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
        outline: 'bg-transparent text-foreground',
        ghost: 'bg-transparent text-foreground border-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export const SelectTrigger = ({
  className,
  variant = 'default',
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> &
  VariantProps<typeof selectTriggerVariants>) => {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(selectTriggerVariants({ variant }), className)}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="size-4" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

export const SelectScrollUpButton = ({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) => {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up"
      className={cn(
        'flex cursor-default font-base items-center justify-center py-1',
        className,
      )}
      {...props}
    >
      <ChevronUp className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

export const SelectScrollDownButton = ({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) => {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down"
      className={cn(
        'flex cursor-default font-base items-center justify-center py-1',
        className,
      )}
      {...props}
    >
      <ChevronDown className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export const selectContentVariants = cva(
  'relative z-50 max-h-96 min-w-32 overflow-hidden rounded-base border-2 border-border data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)',
  {
    variants: {
      variant: {
        default: 'bg-main text-main-foreground',
        neutral: 'bg-secondary text-secondary-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
        outline: 'bg-transparent text-foreground',
        ghost: 'bg-transparent text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export const SelectContent = ({
  className,
  variant = 'default',
  children,
  position = 'popper',
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content> &
  VariantProps<typeof selectContentVariants>) => {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          selectContentVariants({ variant }),
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
          className,
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            'p-1',
            position === 'popper' &&
              'h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width)',
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

export const SelectLabel = ({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) => {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn(
        'border-2 border-transparent py-1.5 pr-8 pl-2 text-sm font-base opacity-80',
        className,
      )}
      {...props}
    />
  )
}

export const selectItemVariants = cva(
  "relative flex w-full cursor-default select-none items-center gap-2 rounded-base py-1.5 pr-8 pl-2 text-sm border-2 border-transparent font-base outline-none focus:border-border data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
  {
    variants: {
      variant: {
        default: 'bg-main text-main-foreground',
        neutral:
          'bg-secondary text-secondary-foreground focus:bg-main focus:text-main-foreground',
        destructive:
          'bg-main text-destructive focus:bg-destructive focus:text-destructive-foreground',
        outline:
          'bg-transparent text-foreground focus:bg-accent focus:text-accent-foreground',
        ghost:
          'bg-transparent text-foreground focus:bg-accent focus:text-accent-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export const SelectItem = ({
  className,
  variant = 'default',
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item> &
  VariantProps<typeof selectItemVariants>) => {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(selectItemVariants({ variant }), className)}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

export const SelectSeparator = ({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) => {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn('-mx-1 my-1 h-px bg-border', className)}
      {...props}
    />
  )
}
