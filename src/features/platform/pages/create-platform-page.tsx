import { Heading } from '@/components'
import { MainLayout } from '@/components/layouts'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import * as m from '@/generated/paraglide/messages'
import { useState } from 'react'
import { CreatePlatformForm } from '../forms'
import { useCreatePlatform } from '../hooks'

export const CreatePlatformPage = () => {
  const [redirect, setRedirect] = useState<boolean>(true)

  const { form, onSubmit, isPending } = useCreatePlatform({ redirect })

  return (
    <MainLayout
      headerContent={
        <>
          <Heading size={'h2'}>{m.page_platform_title()}</Heading>
          <div className="flex items-center gap-2">
            <Switch
              id="redirect-toggle"
              checked={redirect}
              onCheckedChange={setRedirect}
            />
            <Label htmlFor="redirect-toggle">{m.action_redirect()}</Label>
          </div>
        </>
      }
    >
      <CreatePlatformForm
        form={form}
        onSubmit={onSubmit}
        isPending={isPending}
      />
    </MainLayout>
  )
}
