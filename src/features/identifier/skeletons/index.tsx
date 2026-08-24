import { Heading } from '@/components'
import { FormSkeleton, InputImageSkeleton } from '@/components/forms'
import {
  InputTextAreaSkeleton,
  InputTextSkeleton,
} from '@/components/forms/input-skeleton'
import {
  MainLayout,
  PageContainer,
  SectionContainer,
} from '@/components/layouts'
import { IdentifierViewSkeleton } from '@/features/identifier/components'
import * as m from '@/generated/paraglide/messages'

export const EditIdentifierFormSkeleton = () => {
  return (
    <FormSkeleton>
      <InputTextSkeleton />
      <InputTextAreaSkeleton />
      <InputTextSkeleton />
      <InputImageSkeleton />
      <InputTextSkeleton />
    </FormSkeleton>
  )
}

export const DetailIdentifierPageSkeleton = () => {
  return (
    <PageContainer withHeader withFooter>
      <SectionContainer container padded className="min-h-screen">
        <MainLayout
          headerContent={
            <Heading size={'h2'}>{m.page_identifier_title()}</Heading>
          }
        >
          <IdentifierViewSkeleton />
        </MainLayout>
      </SectionContainer>
    </PageContainer>
  )
}

export const EditIdentifierPageSkeleton = () => {
  return (
    <PageContainer withHeader withFooter>
      <SectionContainer container padded className="min-h-screen">
        <MainLayout
          headerContent={
            <Heading size={'h2'}>{m.page_identifier_title()}</Heading>
          }
        >
          <IdentifierViewSkeleton />
        </MainLayout>
      </SectionContainer>
    </PageContainer>
  )
}
