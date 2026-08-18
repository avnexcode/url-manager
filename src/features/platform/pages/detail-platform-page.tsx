import { Heading, Icon } from '@/components'
import {
  MainLayout,
  PageContainer,
  SectionContainer,
} from '@/components/layouts'
import { Badge } from '@/components/ui/badge'
import { useTRPC } from '@/lib/trpc/react'
import { cn } from '@/lib/utils'
import { Route } from '@/routes/{-$locale}/_authenticated/dashboard/platform/$id/view'
import { useSuspenseQuery } from '@tanstack/react-query'
import { PlatformView } from '../components'

export const DetailPlatformPage = () => {
  const { id } = Route.useParams()
  const trpc = useTRPC()

  const { data: platform } = useSuspenseQuery(
    trpc.platform.getById.queryOptions({ id }),
  )

  return (
    <PageContainer withHeader withFooter>
      <SectionContainer container padded className="min-h-screen">
        <MainLayout
          headerContent={
            <>
              <Heading
                size={'h2'}
                className="flex w-full items-center gap-2 leading-normal capitalize"
              >
                {platform.password ? (
                  <Icon
                    name="LockKeyhole"
                    className="h-8 w-8 text-red-500 dark:text-red-600"
                  />
                ) : (
                  <Icon
                    name="LockOpen"
                    className="h-8 w-8 text-green-500 dark:text-green-600"
                  />
                )}
                <span className="max-w-full truncate">{platform.title}</span>
              </Heading>
              <Badge
                variant="default"
                className={cn(
                  'scale-85 font-semibold tracking-[3px] text-white md:scale-100',
                  platform.visibility === 'PRIVATE'
                    ? 'bg-destructive'
                    : 'bg-blue-500 dark:bg-blue-400',
                )}
              >
                {platform.visibility}
              </Badge>
            </>
          }
          headerClassName="flex-col-reverse items-end justify-between xl:flex-row xl:items-center"
          className="space-y-5"
        >
          <PlatformView platform={platform} />
        </MainLayout>
      </SectionContainer>
    </PageContainer>
  )
}
