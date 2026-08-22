import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { VariantProps } from 'class-variance-authority'
import { icons } from 'lucide-react'
import { forwardRef } from 'react'
import type { ActionVariant } from './action-button'
import { ACTION_VARIANT_CONFIG } from './action-button'

type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>

type ExternalLinkProps = Omit<React.ComponentProps<'a'>, 'children'> & {
  href: string
  action: ActionVariant
  disabled?: boolean
  size?: ButtonSize
  hideLabel?: boolean
  children?: React.ReactNode
}

export const ExternalLink = forwardRef<HTMLAnchorElement, ExternalLinkProps>(
  (
    {
      action,
      disabled = false,
      href,
      size = 'default',
      hideLabel = false,
      className,
      children,
      target = '_blank',
      rel = 'noopener noreferrer',
      ...props
    },
    ref,
  ) => {
    const { buttonVariant, defaultIcon, label } = ACTION_VARIANT_CONFIG[action]

    const IconComp = defaultIcon ? icons[defaultIcon] : null
    const labelText = label()

    const smHideLabel = action === 'download'

    const content = children ?? (
      <>
        {IconComp && (
          <IconComp
            className={cn('h-3.5 w-3.5', !hideLabel && 'mr-1.5 sm:mr-0')}
          />
        )}
        {!hideLabel && (
          <span className={cn(smHideLabel && 'sm:hidden')}>{labelText}</span>
        )}
      </>
    )

    if (disabled) {
      return (
        <Button
          variant={buttonVariant}
          size={size}
          disabled
          className={cn('rounded-none capitalize', className)}
        >
          {content}
        </Button>
      )
    }

    return (
      <a
        ref={ref}
        href={href}
        target={target}
        rel={rel}
        className={cn(
          buttonVariants({ variant: buttonVariant, size, className }),
          'rounded-none capitalize',
          className,
        )}
        {...props}
      >
        {content}
      </a>
    )
  },
)

ExternalLink.displayName = 'ExternalLink'
