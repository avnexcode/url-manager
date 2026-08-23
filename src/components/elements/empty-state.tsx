import * as m from '@/generated/paraglide/messages'
import { cn } from '@/lib/utils'
import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  /** Override pesan default "No items found." */
  title?: string
  /** Teks tambahan opsional di bawah title */
  description?: string
  /** Icon custom, default Inbox */
  icon?: React.ComponentType<{ className?: string }>
  /** Slot untuk action button, misal "Create New" */
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center',
        className,
      )}
    >
      <Icon className="size-10 text-muted-foreground" />
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">
          {title ?? m.form_validation_empty_state()}
        </p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}
