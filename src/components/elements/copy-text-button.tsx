'use client'
import { useState } from 'react'
import { CheckIcon, CopyIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type CopyButtonProps = {
  className?: string
  label: string
  copyText: string
  disabled?: boolean
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export const CopyButton = ({
  className,
  label,
  copyText,
  disabled = false,
  size = 'icon',
}: CopyButtonProps) => {
  const [copied, setCopied] = useState<boolean>(false)

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

  const handleCopy = async () => {
    const success = await copyToClipboard(copyText)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="neutral"
            size={size}
            className={cn('disabled:opacity-100', className)}
            onClick={handleCopy}
            aria-label={copied ? 'Copied' : 'Copy to clipboard'}
            disabled={disabled}
          >
            <div
              className={cn(
                'transition-all',
                copied ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
              )}
            >
              <CheckIcon
                className="stroke-emerald-500"
                size={16}
                aria-hidden="true"
              />
            </div>
            <div
              className={cn(
                'absolute transition-all',
                copied ? 'scale-0 opacity-0' : 'scale-100 opacity-100',
              )}
            >
              <CopyIcon size={16} aria-hidden="true" />
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="px-2 py-1 text-xs">
          {copied ? 'Copied!' : label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
