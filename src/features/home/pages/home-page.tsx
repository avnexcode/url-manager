import { PageContainer, SectionContainer } from '@/components/layouts'
import { HeroSection } from '../components'

export const HomePage = () => {
  return (
    <PageContainer>
      <SectionContainer
        container
        padded
        className="flex min-h-screen flex-col items-center justify-center px-4"
      >
        <HeroSection />
      </SectionContainer>
    </PageContainer>
  )
}
