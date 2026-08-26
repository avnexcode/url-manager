import * as React from 'react'

import { Slot } from '@radix-ui/react-slot'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

import { cn } from '#/lib/utils.ts'

export const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-base border-2 border-border px-2.5 py-0.5 text-xs font-base w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-main text-main-foreground shadow-shadow',
        noShadow: 'bg-main text-main-foreground',
        reverse:
          'bg-main text-main-foreground hover:translate-x-reverseBoxShadowX hover:translate-y-reverseBoxShadowY hover:shadow-shadow',
        neutral:
          'bg-secondary text-secondary-foreground shadow-shadow',
        neutralNoShadow: 'bg-secondary text-secondary-foreground',
        neutralReverse:
          'bg-secondary text-secondary-foreground hover:translate-x-reverseBoxShadowX hover:translate-y-reverseBoxShadowY hover:shadow-shadow',
        destructive:
          'bg-destructive text-destructive-foreground shadow-shadow',
        destructiveNoShadow:
          'bg-destructive text-destructive-foreground',
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

export const Badge = ({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean
  }) => {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}
