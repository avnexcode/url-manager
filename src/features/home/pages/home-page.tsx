import { PageContainer, SectionContainer } from '@/components/layouts'
import { HeroSection } from '../components'
import { ParaglideLocaleSelect, ThemeToggle } from '@/components/actions'

export const HomePage = () => {
  return (
    <PageContainer>
      <SectionContainer
        container
        padded
        className="flex min-h-screen flex-col items-center justify-center px-4"
      >
        <header className="flex items-center gap-x-5 absolute top-5 sm:top-10 right-5 sm:right-10">
          <ParaglideLocaleSelect />
          <ThemeToggle />
        </header>
        <HeroSection />
      </SectionContainer>
    </PageContainer>
  )
}
