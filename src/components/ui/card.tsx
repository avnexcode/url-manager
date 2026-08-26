import * as React from 'react'

import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

export const cardVariants = cva(
  'rounded-base flex flex-col border-2 gap-6 py-6 border-border font-base',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground shadow-shadow',
        noShadow: 'bg-card text-card-foreground',
        reverse:
          'bg-card text-card-foreground hover:translate-x-reverseBoxShadowX hover:translate-y-reverseBoxShadowY hover:shadow-shadow',
        neutral: 'bg-secondary text-secondary-foreground shadow-shadow',
        neutralNoShadow: 'bg-secondary text-secondary-foreground',
        neutralReverse:
          'bg-secondary text-secondary-foreground hover:translate-x-reverseBoxShadowX hover:translate-y-reverseBoxShadowY hover:shadow-shadow',
        destructive:
          'bg-destructive text-destructive-foreground shadow-shadow',
        destructiveNoShadow: 'bg-destructive text-destructive-foreground',
        destructiveReverse:
          'bg-destructive text-destructive-foreground hover:translate-x-reverseBoxShadowX hover:translate-y-reverseBoxShadowY hover:shadow-shadow',
        outline: 'bg-transparent text-foreground shadow-shadow',
        outlineNoShadow: 'bg-transparent text-foreground',
        outlineReverse:
          'bg-transparent text-foreground hover:translate-x-reverseBoxShadowX hover:translate-y-reverseBoxShadowY hover:shadow-shadow',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export const Card = ({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof cardVariants>) => {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  )
}

export const CardHeader = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-[data-slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className,
      )}
      {...props}
    />
  )
}

export const CardTitle = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="card-title"
      className={cn('font-heading leading-none', className)}
      {...props}
    />
  )
}

export const CardDescription = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="card-description"
      className={cn('text-sm font-base', className)}
      {...props}
    />
  )
}

export const CardAction = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className,
      )}
      {...props}
    />
  )
}

export const CardContent = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="card-content"
      className={cn('px-6', className)}
      {...props}
    />
  )
}

export const CardFooter = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
      {...props}
    />
  )
}
