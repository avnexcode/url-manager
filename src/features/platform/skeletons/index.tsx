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
import { PlatformViewSkeleton } from '@/features/platform/components'
import * as m from '@/generated/paraglide/messages'

export const EditPlatformFormSkeleton = () => {
  return (
    <FormSkeleton>
      <InputTextSkeleton />
      <InputTextAreaSkeleton />
      <InputTextSkeleton />
      <InputTextSkeleton />
      <InputImageSkeleton />
      <InputTextSkeleton />
    </FormSkeleton>
  )
}

export const DetailPlatformPageSkeleton = () => {
  return (
    <PageContainer withHeader withFooter>
      <SectionContainer container padded className="min-h-screen">
        <MainLayout
          headerContent={
            <Heading size={'h2'}>{m.page_platform_title()}</Heading>
          }
        >
          <PlatformViewSkeleton />
        </MainLayout>
      </SectionContainer>
    </PageContainer>
  )
}

export const EditPlatformPageSkeleton = () => {
  return (
    <PageContainer withHeader withFooter>
      <SectionContainer container padded className="min-h-screen">
        <MainLayout
          headerContent={
            <Heading size={'h2'}>{m.page_platform_title()}</Heading>
          }
        >
          <EditPlatformFormSkeleton />
        </MainLayout>
      </SectionContainer>
    </PageContainer>
  )
}
