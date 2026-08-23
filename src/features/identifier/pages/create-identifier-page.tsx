import { Heading } from '@/components'
import {
  MainLayout,
  PageContainer,
  SectionContainer,
} from '@/components/layouts'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import * as m from '@/generated/paraglide/messages'
import { useState } from 'react'
import { CreateIdentifierForm } from '../forms'
import { useCreateIdentifier } from '../hooks'

export const CreateIdentifierPage = () => {
  const [redirect, setRedirect] = useState<boolean>(true)

  const { form, onSubmit, isPending } = useCreateIdentifier({ redirect })
  return (
    <PageContainer withHeader withFooter>
      <SectionContainer container padded className="min-h-screen">
        <MainLayout
          headerContent={
            <>
              <Heading size={'h2'}>{m.page_identifier_title()}</Heading>
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
          <CreateIdentifierForm
            form={form}
            onSubmit={onSubmit}
            isPending={isPending}
          />
        </MainLayout>
      </SectionContainer>
    </PageContainer>
  )
}
