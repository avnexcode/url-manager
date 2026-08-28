import { Label } from '@/components/ui/label'

type SettingsCardProps = {
  label: string
  children: React.ReactNode
}

export const SettingsCard = ({ children, label }: SettingsCardProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label
          htmlFor="currency"
          className="flex items-center gap-2 text-base font-base"
        >
          {label}
        </Label>
      </div>
      {children}
    </div>
  )
}
