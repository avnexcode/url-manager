import { Heading } from '@/components'
import { FormSkeleton, InputImageSkeleton } from '@/components/forms'
import {
  InputTextAreaSkeleton,
  InputTextSkeleton,
} from '@/components/forms/input-skeleton'
import {
  MainLayout,
  PageContainer,
  PublicLayout,
  SectionContainer,
} from '@/components/layouts'
import {
  PlatformViewSkeleton,
  PublicPlatformViewSkeleton,
} from '@/features/platform/components'
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

export const PublicDetailPlatformPageSkeleton = () => {
  return (
    <PageContainer withFooter>
      <SectionContainer container padded className="min-h-screen">
        <PublicLayout
          headerContent={
            <Heading size={'h2'}>{m.page_platform_title()}</Heading>
          }
        >
          <PublicPlatformViewSkeleton />
        </PublicLayout>
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
