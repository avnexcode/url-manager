import * as React from 'react'

import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import { Check, ChevronRight, Circle } from 'lucide-react'
import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui'

import { cn } from '#/lib/utils.ts'

export const DropdownMenu = ({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) => {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

export const DropdownMenuTrigger = ({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) => {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  )
}

export const DropdownMenuGroup = ({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) => {
  return <DropdownMenuPrimitive.Group {...props} />
}

export const DropdownMenuPortal = ({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) => {
  return <DropdownMenuPrimitive.Portal {...props} />
}

export const DropdownMenuSub = ({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) => {
  return <DropdownMenuPrimitive.Sub {...props} />
}

export const DropdownMenuRadioGroup = ({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) => {
  return <DropdownMenuPrimitive.RadioGroup {...props} />
}

export const DropdownMenuSubTrigger = ({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean
}) => {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        'flex cursor-default select-none items-center rounded-base border-2 border-transparent bg-main px-2 py-1.5 text-sm font-base outline-hidden focus:border-border gap-2 data-[inset=true]:pl-8 [&_svg]:pointer-events-none [&_svg]:w-4 [&_svg]:h-4 [&_svg]:shrink-0',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto" />
    </DropdownMenuPrimitive.SubTrigger>
  )
}

export const dropdownMenuContentVariants = cva(
  'z-50 min-w-32 overflow-hidden rounded-base border-2 border-border p-1 font-base data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)',
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

export const DropdownMenuSubContent = ({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent> &
  VariantProps<typeof dropdownMenuContentVariants>) => {
  return (
    <DropdownMenuPrimitive.SubContent
      className={cn(dropdownMenuContentVariants({ variant }), className)}
      {...props}
    />
  )
}

export const DropdownMenuContent = ({
  className,
  variant = 'default',
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content> &
  VariantProps<typeof dropdownMenuContentVariants>) => {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(dropdownMenuContentVariants({ variant }), className)}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

export const dropdownMenuItemVariants = cva(
  'relative gap-2 [&_svg]:pointer-events-none [&_svg]:w-4 [&_svg]:h-4 [&_svg]:shrink-0 flex cursor-default select-none items-center rounded-base border-2 border-transparent data-[inset=true]:pl-8 px-2 py-1.5 text-sm font-base outline-hidden transition-colors focus:border-border data-disabled:pointer-events-none data-disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-main text-main-foreground',
        neutral:
          'bg-secondary text-secondary-foreground focus:bg-main focus:text-main-foreground',
        destructive:
          'bg-main text-destructive focus:bg-destructive focus:text-destructive-foreground',
        outline: 'bg-transparent text-foreground',
        link: 'bg-transparent text-foreground underline-offset-4 hover:underline',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export const DropdownMenuItem = ({
  className,
  inset,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> &
  VariantProps<typeof dropdownMenuItemVariants> & {
    inset?: boolean
  }) => {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      className={cn(dropdownMenuItemVariants({ variant }), className)}
      {...props}
    />
  )
}

export const DropdownMenuCheckboxItem = ({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) => {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      className={cn(
        "relative flex cursor-default select-none items-center rounded-base border-2 border-transparent gap-2 py-1.5 pl-8 pr-2 text-sm font-base text-main-foreground outline-hidden transition-colors focus:border-border data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      checked={checked}
      {...props}
    >
      <span className="absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Check />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
}

export const DropdownMenuRadioItem = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) => {
  return (
    <DropdownMenuPrimitive.RadioItem
      className={cn(
        'relative flex cursor-default select-none items-center rounded-base border-2 border-transparent gap-2 py-1.5 pl-8 pr-2 text-sm font-base outline-hidden transition-colors focus:border-border data-disabled:pointer-events-none data-disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Circle className="size-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
}

export const DropdownMenuLabel = ({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean
}) => {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        'px-2 py-1.5 text-sm font-heading data-inset:pl-8',
        className,
      )}
      {...props}
    />
  )
}

export const DropdownMenuSeparator = ({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) => {
  return (
    <DropdownMenuPrimitive.Separator
      className={cn('-mx-1 my-1 h-0.5 bg-border', className)}
      {...props}
    />
  )
}

export const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn('ml-auto text-xs font-base tracking-widest', className)}
      {...props}
    />
  )
}
