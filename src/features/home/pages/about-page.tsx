import { Heading } from '@/components'
import { PageContainer, SectionContainer } from '@/components/layouts'
import * as m from '@/generated/paraglide/messages'

export const AboutPage = () => {
  return (
    <PageContainer withHeader withFooter>
      <SectionContainer container padded>
        <Heading>{m.page_about_title()}</Heading>
      </SectionContainer>
    </PageContainer>
  )
}
