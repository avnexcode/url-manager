import { Icon } from '@/components/icon'
import { Label } from '@/components/ui/label'
import type { icons } from 'lucide-react'

type SettingsCardProps = {
  label: string
  caption: string
  icon: keyof typeof icons
  children: React.ReactNode
}

export const SettingsCard = ({
  children,
  label,
  caption,
  icon,
}: SettingsCardProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label htmlFor="currency" className="flex items-center gap-2 text-base">
          <Icon name={icon} className="text-muted-foreground h-5 w-5" />
          {label}
        </Label>
        <p className="text-muted-foreground text-sm">{caption}</p>
      </div>
      {children}
    </div>
  )
}
