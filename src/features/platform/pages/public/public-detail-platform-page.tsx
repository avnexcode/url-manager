import { Heading } from '@/components'
import { PublicAccessPasswordForm } from '@/components/fragments'
import {
  PageContainer,
  PublicLayout,
  SectionContainer,
} from '@/components/layouts'
import { PublicUrlListSection } from '@/features/url/components'
import * as m from '@/generated/paraglide/messages'
import { useQueryParams } from '@/hooks'
import { useTRPC } from '@/lib/trpc/react'
import { Route } from '@/routes/{-$locale}/_public/$username/platform/$slug'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { useSearch } from '@tanstack/react-router'
import { PublicPlatformView } from '../../components'
import { usePublicPlatformAccessPassword } from '../../hooks'

export const DetailPlatformPage = () => {
  const { username, slug } = Route.useParams()

  const { password } = useSearch({ strict: false })

  const trpc = useTRPC()

  const { data: platform } = useSuspenseQuery(
    trpc.platform.getPublicBySlug.queryOptions({ username, slug }),
  )

  const { queryParams, handleUpdateQuery } = useQueryParams()

  const { data: urls, isLoading: isUrlsLoading } = useQuery(
    trpc.url.getPublicAll.queryOptions({
      username,
      params: { ...queryParams },
      relation: { platformSlug: slug },
    }),
  )

  const { form, onSubmit, isPending } = usePublicPlatformAccessPassword(
    username,
    slug,
  )

  return (
    <PageContainer withFooter>
      <SectionContainer container padded className="min-h-screen">
        <PublicLayout
          headerContent={
            <Heading size={'h2'}>{m.page_platform_title()}</Heading>
          }
        >
          {platform.password && platform.password !== password ? (
            <div className="w-full pt-12">
              <div className="border-border bg-main flex w-full flex-col gap-6 border-2 sm:p-8 shadow-shadow xl:flex-row xl:items-center xl:justify-between">
                <div className="max-w-xl space-y-2 p-8">
                  <Heading size={'h3'}>{platform.title}</Heading>
                  <p className="text-foreground/70 text-sm">
                    {m.component_view_password_restricted_description({
                      model: m.model_platform_title(),
                    })}
                  </p>
                </div>
                <div className="p-3 w-full sm:p-0">
                  <PublicAccessPasswordForm
                    form={form}
                    onSubmit={onSubmit}
                    isPending={isPending}
                    cancelTo={'/{-$locale}/$username/platform'}
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              <PublicPlatformView platform={platform} />
              <PublicUrlListSection
                urls={urls}
                isUrlsLoading={isUrlsLoading}
                queryParams={queryParams}
                handleUpdateQuery={handleUpdateQuery}
              />
            </>
          )}
        </PublicLayout>
      </SectionContainer>
    </PageContainer>
  )
}
