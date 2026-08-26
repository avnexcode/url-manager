import * as React from 'react'

import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

import { cn } from '#/lib/utils.ts'

export const alertVariants = cva(
  'relative w-full rounded-base border-2 border-border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current',
  {
    variants: {
      variant: {
        default: 'bg-main text-main-foreground shadow-shadow',
        noShadow: 'bg-main text-main-foreground',
        reverse:
          'bg-main text-main-foreground hover:translate-x-reverseBoxShadowX hover:translate-y-reverseBoxShadowY hover:shadow-shadow',
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
        warning: 'bg-warning text-warning-foreground',
        success: 'bg-success text-success-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export const Alert = ({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) => {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

export const AlertTitle = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        'col-start-2 line-clamp-1 min-h-4 font-heading tracking-tight',
        className,
      )}
      {...props}
    />
  )
}

export const AlertDescription = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        'col-start-2 grid justify-items-start gap-1 text-sm font-base [&_p]:leading-relaxed',
        className,
      )}
      {...props}
    />
  )
}
