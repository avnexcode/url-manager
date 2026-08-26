import * as React from 'react'

import { buttonVariants } from '#/components/ui/button.tsx'
import type { VariantProps } from 'class-variance-authority'
import * as m from '@/generated/paraglide/messages'
import { cva } from 'class-variance-authority'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

import { cn } from '#/lib/utils.ts'

export const Pagination = ({
  className,
  ...props
}: React.ComponentProps<'nav'>) => {
  return (
    <nav
      data-slot="pagination"
      role="navigation"
      aria-label="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  )
}

export const paginationContentVariants = cva(
  'flex flex-row items-center gap-1',
  {
    variants: {
      variant: {
        default: '',
        neutral: 'bg-secondary text-secondary-foreground rounded-base p-1',
        outline: 'bg-transparent border-2 border-border rounded-base p-1',
        ghost: 'bg-transparent rounded-base p-1',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export const PaginationContent = ({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<'ul'> &
  VariantProps<typeof paginationContentVariants>) => {
  return (
    <ul
      data-slot="pagination-content"
      className={cn(paginationContentVariants({ variant }), className)}
      {...props}
    />
  )
}

export const paginationItemVariants = cva('', {
  variants: {
    variant: {
      default: '',
      neutral: 'bg-secondary text-secondary-foreground rounded-base',
      outline: 'bg-transparent border-2 border-border rounded-base',
      ghost: 'bg-transparent rounded-base',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export const PaginationItem = ({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<'li'> &
  VariantProps<typeof paginationItemVariants>) => {
  return (
    <li
      data-slot="pagination-item"
      className={cn(paginationItemVariants({ variant }), className)}
      {...props}
    />
  )
}

export const PaginationLink = ({
  className,
  isActive,
  variant = 'noShadow',
  size = 'icon',
  ...props
}: React.ComponentProps<'a'> &
  VariantProps<typeof buttonVariants> & {
    isActive?: boolean
  }) => {
  return (
    <a
      data-slot="pagination-link"
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        buttonVariants({ variant, size }),
        className,
        isActive && 'bg-foreground text-background',
      )}
      {...props}
    />
  )
}

export const PaginationPrevious = ({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => {
  return (
    <PaginationLink
      data-slot="pagination-previous"
      aria-label="Go to previous page"
      size="default"
      variant={variant}
      className={cn('gap-1 pl-2.5', className)}
      {...props}
    >
      <ChevronLeft className="size-4" />
      <span>{m.action_previous()}</span>
    </PaginationLink>
  )
}

export const PaginationNext = ({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => {
  return (
    <PaginationLink
      data-slot="pagination-next"
      aria-label="Go to next page"
      size="default"
      variant={variant}
      className={cn('gap-1 pr-2.5', className)}
      {...props}
    >
      <span>{m.action_next()}</span>
      <ChevronRight className="size-4" />
    </PaginationLink>
  )
}

export const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => {
  return (
    <span
      data-slot="pagination-ellipsis"
      aria-hidden
      className={cn('flex size-9 items-center justify-center', className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}
