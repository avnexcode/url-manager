import * as React from 'react'

import { Switch as SwitchPrimitive } from 'radix-ui'

import { cn } from '#/lib/utils.ts'

export const Switch = ({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) => {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'peer inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-border bg-secondary-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-main data-[state=unchecked]:bg-secondary-background',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'pointer-events-none block h-4 w-4 rounded-full bg-foreground border-2 border-border ring-0 transition-transform data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-1 data-[state=checked]:bg-main-foreground',
        )}
      />
    </SwitchPrimitive.Root>
  )
}
