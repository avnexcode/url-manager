import { Heading } from '@/components'
import {
  FormSkeleton,
  InputImageSkeleton,
  InputTextAreaSkeleton,
  InputTextSkeleton,
} from '@/components/forms'
import {
  MainLayout,
  PageContainer,
  PublicLayout,
  SectionContainer,
} from '@/components/layouts'
import {
  IdentifierViewSkeleton,
  PublicIdentifierViewSkeleton,
} from '@/features/identifier/components'
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

export const PublicDetailIdentifierPageSkeleton = () => {
  return (
    <PageContainer withFooter>
      <SectionContainer container padded className="min-h-screen">
        <PublicLayout
          headerContent={
            <Heading size={'h2'}>{m.page_identifier_title()}</Heading>
          }
        >
          <PublicIdentifierViewSkeleton />
        </PublicLayout>
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
