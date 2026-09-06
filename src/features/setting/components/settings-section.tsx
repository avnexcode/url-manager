import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

type SettingsSectionProps = {
  title: string
  caption: string
  className?: string
  children: React.ReactNode
}

export const SettingsSection = ({
  children,
  className,
  title,
  caption,
}: SettingsSectionProps) => {
  return (
    <Card className={cn('w-full border-0 shadow-0', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          {title}
        </CardTitle>
        <CardDescription>{caption}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-10 pb-10 pt-5">{children}</CardContent>
      <Separator />
    </Card>
  )
}
