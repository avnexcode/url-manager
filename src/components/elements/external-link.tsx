import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { VariantProps } from 'class-variance-authority'
import type { LucideIcon } from 'lucide-react'
import { forwardRef } from 'react'
import type { ActionVariant } from './action-button'
import { ACTION_VARIANT_CONFIG, ICON_SIZE_CLASS } from './action-button'
import { Skeleton } from '../ui/skeleton'

type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>

type ExternalLinkProps = Omit<React.ComponentProps<'a'>, 'children'> & {
  href: string
  action: ActionVariant
  icon?: LucideIcon
  disabled?: boolean
  size?: ButtonSize
  hideLabel?: boolean
  iconClassName?: string
  children?: React.ReactNode
}

export const ExternalLink = forwardRef<HTMLAnchorElement, ExternalLinkProps>(
  (
    {
      action,
      icon,
      disabled = false,
      href,
      size = 'default',
      hideLabel = false,
      iconClassName,
      className,
      children,
      target = '_blank',
      rel = 'noopener noreferrer',
      ...props
    },
    ref,
  ) => {
    const { buttonVariant, defaultIcon, label } = ACTION_VARIANT_CONFIG[action]

    const IconComp = icon ?? defaultIcon
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

type ExternalLinkSkeletonProps = {
  action?: ActionVariant
  size?: ButtonSize
  hideLabel?: boolean
  labelWidth?: string
  className?: string
}

export const ExternalLinkSkeleton = ({
  action,
  size = 'default',
  hideLabel = false,
  labelWidth = 'w-20',
  className,
}: ExternalLinkSkeletonProps) => {
  if (hideLabel || size === 'icon') {
    return (
      <Skeleton
        className={cn(ICON_ONLY_SIZE_CLASS[size], 'shrink-0', className)}
      />
    )
  }

  const smHideLabel = action === 'download'

  if (smHideLabel) {
    return (
      <Skeleton
        className={cn(
          HEIGHT_CLASS[size],
          'flex items-center gap-1.5 px-3 shrink-0',
          className,
        )}
      >
        <Skeleton className="h-3.5 w-3.5 shrink-0" />
        <Skeleton className={cn('h-3.5 sm:hidden', labelWidth)} />
      </Skeleton>
    )
  }

  return (
    <Skeleton
      className={cn(HEIGHT_CLASS[size], labelWidth, 'shrink-0', className)}
    />
  )
}
