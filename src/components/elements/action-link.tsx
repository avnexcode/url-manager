import { Button, buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { LinkProps } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { icons } from 'lucide-react'
import { forwardRef } from 'react'
import type { ActionVariant, ButtonSize } from './action-button'
import { ACTION_VARIANT_CONFIG, ICON_SIZE_CLASS } from './action-button'

type ActionLinkProps = Omit<React.ComponentProps<'a'>, 'href' | 'children'> &
  Pick<LinkProps, 'to' | 'replace' | 'preload' | 'search'> & {
    action: ActionVariant
    disabled?: boolean
    size?: ButtonSize
    hideLabel?: boolean
    /** Override the icon's default size (auto-derived from `size` otherwise). */
    iconClassName?: string
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
      iconClassName,
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
    const resolvedIconSize = iconClassName ?? ICON_SIZE_CLASS[size]

    const content = children ?? (
      <>
        {IconComp && (
          <IconComp
            className={cn(resolvedIconSize, !hideLabel && 'mr-1.5 sm:mr-0')}
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

/**
 * Skeleton counterpart of ActionLink.
 *
 * NOTE: height/size values mirror ActionButtonSkeleton (same underlying
 * `buttonVariants` sizes, since ActionLink is rendered as a button-styled
 * anchor). If `buttonVariants` sizes change, keep this map and the one in
 * action-button.tsx in sync.
 */
const HEIGHT_CLASS: Record<ButtonSize, string> = {
  default: 'h-9',
  sm: 'h-8',
  lg: 'h-10',
  icon: 'size-9',
}

const ICON_ONLY_SIZE_CLASS: Record<ButtonSize, string> = {
  default: 'size-9',
  sm: 'size-8',
  lg: 'size-10',
  icon: 'size-9',
}

type ActionLinkSkeletonProps = {
  /** Mirrors the `size` prop of ActionLink. */
  size?: ButtonSize
  /** Mirrors `hideLabel`. When true, renders a square icon-only skeleton. */
  hideLabel?: boolean
  /**
   * Tailwind width class for the label portion (ignored when hideLabel).
   * Label length varies a lot by action, so this isn't inferred
   * automatically — pass one close to the real action's label width.
   */
  labelWidth?: string
  className?: string
}

export const ActionLinkSkeleton = ({
  size = 'default',
  hideLabel = false,
  labelWidth = 'w-20',
  className,
}: ActionLinkSkeletonProps) => {
  if (hideLabel || size === 'icon') {
    return (
      <Skeleton
        className={cn(ICON_ONLY_SIZE_CLASS[size], 'shrink-0', className)}
      />
    )
  }

  return (
    <Skeleton
      className={cn(HEIGHT_CLASS[size], labelWidth, 'shrink-0', className)}
    />
  )
}
