import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { LinkProps } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import type { VariantProps } from 'class-variance-authority'
import { icons } from 'lucide-react'
import { forwardRef } from 'react'
import type { ActionVariant } from './action-button'
import { ACTION_VARIANT_CONFIG } from './action-button'

type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>

type ActionLinkProps = Omit<React.ComponentProps<'a'>, 'href' | 'children'> &
  Pick<LinkProps, 'to' | 'replace' | 'preload'> & {
    action: ActionVariant
    disabled?: boolean
    size?: ButtonSize
    hideLabel?: boolean
    children?: React.ReactNode
  }

export const ActionLink = forwardRef<HTMLAnchorElement, ActionLinkProps>(
  (
    {
      action,
      disabled = false,
      to,
      replace,
      preload = false,
      size = 'default',
      hideLabel = false,
      className,
      children,
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
      <Link
        ref={ref}
        to={to}
        replace={replace}
        preload={preload}
        className={cn(
          buttonVariants({ variant: buttonVariant, size, className }),
          'rounded-none capitalize',
          className,
        )}
        {...props}
      >
        {content}
      </Link>
    )
  },
)

ActionLink.displayName = 'ActionLink'
