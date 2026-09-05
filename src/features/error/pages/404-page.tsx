import { Heading } from '@/components/heading'
import { PageContainer, SectionContainer } from '@/components/layouts'
import { buttonVariants } from '@/components/ui/button'
import * as m from '@/generated/paraglide/messages'
import { cn } from '@/lib/utils'
import { GoBackButton } from '../components'

export const Error404Page = () => {
  return (
    <PageContainer>
      <SectionContainer
        container
        className="flex min-h-screen items-center justify-center"
      >
        <div className="flex h-full w-full flex-col items-center justify-center text-center">
          <div
            className={cn(
              buttonVariants({ variant: 'neutral' }),
              'mb-10 py-10 px-20',
            )}
          >
            <span className="text-5xl">404</span>
          </div>

          <Heading size={'h3'} className="mb-3">
            {m.page_error_404_heading()}
          </Heading>

          <p className="mb-8 max-w-md text-zinc-500 dark:text-zinc-400">
            {m.page_error_404_description()}
          </p>

          <GoBackButton />
        </div>
      </SectionContainer>
    </PageContainer>
  )
}
