import { Heading } from '@/components'
import { PageContainer, SectionContainer } from '@/components/layouts'
import * as m from '@/generated/paraglide/messages'
import { useTRPC } from '@/integrations/trpc/react'
import { useQuery } from '@tanstack/react-query'

export const HomePage = () => {
  const trpc = useTRPC()
  const { data: test, isLoading: isTestLoading } = useQuery(
    trpc.test.test.queryOptions(),
  )

  return (
    <PageContainer withHeader withFooter>
      <SectionContainer container padded>
        <Heading>{m.page_home_title()}</Heading>
        <div>{isTestLoading ? <>Loading...</> : <p>{test?.message}</p>}</div>
      </SectionContainer>
    </PageContainer>
  )
}
