'use client'
import { cn } from '@/lib/utils'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

type TogglePasswordVisibilityProps = {
  className?: string
  isVisible: boolean
  setIsVisible: (isVisible: boolean) => void
}

export const TogglePasswordVisibility = ({
  className,
  isVisible,
  setIsVisible,
}: TogglePasswordVisibilityProps) => {
  const toggleVisibility = () => setIsVisible(!isVisible)
  return (
    <button
      className={cn(
        'text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 inset-e-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      type="button"
      onClick={toggleVisibility}
      aria-label={isVisible ? 'Hide password' : 'Show password'}
      aria-pressed={isVisible}
      aria-controls="confirmPassword"
    >
      {isVisible ? (
        <EyeOffIcon size={16} aria-hidden="true" />
      ) : (
        <EyeIcon size={16} aria-hidden="true" />
      )}
    </button>
  )
}
