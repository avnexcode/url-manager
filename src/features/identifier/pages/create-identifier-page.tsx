import { Heading } from '@/components'
import {
  MainLayout,
  PageContainer,
  SectionContainer,
} from '@/components/layouts'
import * as m from '@/generated/paraglide/messages'
import { CreateIdentifierForm } from '../forms'
import { useCreateIdentifier } from '../hooks'

export const CreateIdentifierPage = () => {
  const { form, onSubmit, isPending } = useCreateIdentifier()
  return (
    <PageContainer withHeader withFooter>
      <SectionContainer container padded className="min-h-screen">
        <MainLayout
          headerContent={
            <Heading size={'h2'}>{m.page_identifier_title()}</Heading>
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
