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
import * as m from '@/generated/paraglide/messages'
import { UrlViewSkeleton } from '../components/url-view'

export const EditUrlFormSkeleton = () => {
  return (
    <FormSkeleton>
      <InputTextSkeleton />
      <InputTextSkeleton />
      <InputTextAreaSkeleton />
      <InputImageSkeleton />
      <InputTextSkeleton />
      <InputTextSkeleton />
    </FormSkeleton>
  )
}

export const DetailUrlPageSkeleton = () => {
  return (
    <PageContainer withHeader withFooter>
      <SectionContainer container padded className="min-h-screen">
        <MainLayout
          headerContent={<Heading size={'h2'}>{m.page_url_title()}</Heading>}
        >
          <UrlViewSkeleton />
        </MainLayout>
      </SectionContainer>
    </PageContainer>
  )
}

export const EditUrlPageSkeleton = () => {
  return (
    <PageContainer withHeader withFooter>
      <SectionContainer container padded className="min-h-screen">
        <MainLayout
          headerContent={<Heading size={'h2'}>{m.page_url_title()}</Heading>}
        >
          <EditUrlFormSkeleton />
        </MainLayout>
      </SectionContainer>
    </PageContainer>
  )
}
