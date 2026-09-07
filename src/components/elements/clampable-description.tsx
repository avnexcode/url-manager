import { cn } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'
import * as m from '@/generated/paraglide/messages'

interface ClampableDescriptionProps {
  description?: string | null
  maxLines?: number
}

export const ClampableDescription = ({
  description,
  maxLines = 2,
}: ClampableDescriptionProps) => {
  const textRef = useRef<HTMLParagraphElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isTruncated, setIsTruncated] = useState(false)

  useEffect(() => {
    const el = textRef.current
    if (!el) {
      return
    }

    setIsTruncated(el.scrollHeight > el.clientHeight)
  }, [description])

  if (!description) {
    return null
  }

  return (
    <div className="">
      <p
        ref={textRef}
        className={cn(
          'text-sm text-muted-foreground',
          !isExpanded && `line-clamp-${maxLines}`,
        )}
      >
        {description}
      </p>

      {isTruncated && (
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="text-xs font-medium text-primary hover:underline mt-0.5"
        >
          {isExpanded ? m.action_show_less() : m.action_show_more()}
        </button>
      )}
    </div>
  )
}
