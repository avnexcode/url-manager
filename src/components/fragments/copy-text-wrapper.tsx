import { cn } from '@/lib/utils'
import { forwardRef, useState } from 'react'
import { Icon } from '../icon'

type CopyTextWrapperProps = {
  iconClassName?: string
}

export const CopyTextWrapper = forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & CopyTextWrapperProps
>(({ children, className, iconClassName, ...props }, ref) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const text = typeof children === 'string' ? children : String(children)
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <span
      ref={ref}
      className={cn(
        'group inline-flex cursor-pointer items-center gap-1',
        className,
      )}
      onClick={handleCopy}
      {...props}
    >
      <span
        className={cn(
          'transition-all duration-300',
          copied && 'text-muted-foreground',
        )}
      >
        {children}
      </span>

      <span className="relative flex size-4 shrink-0 items-center justify-center">
        <Icon
          name="Copy"
          className={cn(
            'absolute size-4 transition-all duration-300',
            copied
              ? 'scale-0 rotate-90 opacity-0'
              : 'text-muted-foreground group-hover:text-foreground scale-100 rotate-0 opacity-100',
            iconClassName,
          )}
        />
        <Icon
          name="Check"
          className={cn(
            'absolute size-4 text-green-500 transition-all duration-300',
            copied
              ? 'scale-100 rotate-0 opacity-100'
              : 'scale-0 -rotate-90 opacity-0',
          )}
        />
      </span>
    </span>
  )
})

CopyTextWrapper.displayName = 'CopyTextWrapper'
