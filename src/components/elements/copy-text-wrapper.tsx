import { cn } from '@/lib/utils'
import { Check, Copy } from 'lucide-react'
import { forwardRef, useState } from 'react'

type CopyTextWrapperProps = {
  iconClassName?: string
}

const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (window.isSecureContext) {
      await navigator.clipboard.writeText(text)
    } else {
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
    return true
  } catch (err) {
    console.error('Failed to copy text: ', err)
    return false
  }
}

export const CopyTextWrapper = forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & CopyTextWrapperProps
>(({ children, className, iconClassName, ...props }, ref) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const text = typeof children === 'string' ? children : String(children)
    const success = await copyToClipboard(text)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
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
        <Copy
          className={cn(
            'absolute size-4 transition-all duration-300',
            copied
              ? 'scale-0 rotate-90 opacity-0'
              : 'text-muted-foreground group-hover:text-foreground scale-100 rotate-0 opacity-100',
            iconClassName,
          )}
        />
        <Check
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
