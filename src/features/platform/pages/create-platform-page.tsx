import { Heading } from '@/components'
import {
  MainLayout,
  PageContainer,
  SectionContainer,
} from '@/components/layouts'
import * as m from '@/generated/paraglide/messages'
import { CreatePlatformForm } from '../forms'
import { useCreatePlatform } from '../hooks'

export const CreatePlatformPage = () => {
  const { form, onSubmit, isPending } = useCreatePlatform()

  return (
    <PageContainer withHeader withFooter>
      <SectionContainer container padded className="min-h-screen">
        <MainLayout
          headerContent={
            <Heading size={'h2'}>{m.page_platform_title()}</Heading>
          }
        >
          <CreatePlatformForm
            form={form}
            onSubmit={onSubmit}
            isPending={isPending}
          />
        </MainLayout>
      </SectionContainer>
    </PageContainer>
  )
}
