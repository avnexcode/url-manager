import * as React from 'react'

import { Slot } from '@radix-ui/react-slot'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

import { cn } from '#/lib/utils.ts'

export const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-base text-sm font-base ring-offset-background transition-all gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'text-main-foreground bg-main border-2 border-border shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none',
        noShadow: 'text-main-foreground bg-main border-2 border-border',
        reverse:
          'text-main-foreground bg-main border-2 border-border hover:translate-x-reverseBoxShadowX hover:translate-y-reverseBoxShadowY hover:shadow-shadow',
        neutral:
          'bg-secondary text-secondary-foreground border-2 border-border shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none',
        neutralNoShadow:
          'bg-secondary text-secondary-foreground border-2 border-border',
        neutralReverse:
          'bg-secondary text-secondary-foreground border-2 border-border hover:translate-x-reverseBoxShadowX hover:translate-y-reverseBoxShadowY hover:shadow-shadow',
        destructive:
          'text-destructive-foreground bg-destructive border-2 border-border shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none',
        destructiveNoShadow:
          'text-destructive-foreground bg-destructive border-2 border-border',
        destructiveReverse:
          'text-destructive-foreground bg-destructive border-2 border-border hover:translate-x-reverseBoxShadowX hover:translate-y-reverseBoxShadowY hover:shadow-shadow',
        outline:
          'bg-transparent text-foreground border-2 border-border shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none',
        outlineNoShadow: 'bg-transparent text-foreground border-2 border-border',
        outlineReverse:
          'bg-transparent text-foreground border-2 border-border hover:translate-x-reverseBoxShadowX hover:translate-y-reverseBoxShadowY hover:shadow-shadow',
        ghost:
          'bg-transparent text-foreground border-2 border-transparent hover:bg-accent hover:text-accent-foreground hover:border-border',
        link: 'text-foreground underline-offset-4 hover:underline border-2 border-transparent',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export const Button = ({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) => {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
