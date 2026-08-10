import type { LucideProps } from 'lucide-react'
import { icons } from 'lucide-react'
import { forwardRef } from 'react'

type IconProps = {
  name: keyof typeof icons
} & Omit<LucideProps, 'ref'>

export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ name, color, size = 40, className, ...prop }, ref) => {
    const LucideIcon = icons[name]

    return (
      <LucideIcon
        ref={ref}
        color={color}
        size={size}
        className={className}
        {...prop}
      />
    )
  },
)

Icon.displayName = 'Icon'

