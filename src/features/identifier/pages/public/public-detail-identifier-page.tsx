import { Heading } from '@/components'
import { PublicAccessPasswordForm } from '@/components/fragments'
import { PublicLayout } from '@/components/layouts'
import { PublicUrlListSection } from '@/features/url/components'
import * as m from '@/generated/paraglide/messages'
import { useQueryParams } from '@/hooks'
import { useTRPC } from '@/lib/trpc/react'
import { Route } from '@/routes/{-$locale}/_public/$username/identifier/$slug'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { useSearch } from '@tanstack/react-router'
import { PublicIdentifierView } from '../../components'
import { usePublicIdentifierAccessPassword } from '../../hooks'

export const DetailIdentifierPage = () => {
  const { username, slug } = Route.useParams()

  const { password } = useSearch({ strict: false })

  const trpc = useTRPC()

  const { data: identifier } = useSuspenseQuery(
    trpc.identifier.getPublicBySlug.queryOptions({ username, slug }),
  )

  const { queryParams, handleUpdateQuery } = useQueryParams()

  const { data: urls, isLoading: isUrlsLoading } = useQuery(
    trpc.url.getPublicAll.queryOptions({
      username,
      params: { ...queryParams },
      relation: { identifierSlug: slug },
    }),
  )

  const { form, onSubmit, isPending } = usePublicIdentifierAccessPassword(
    username,
    slug,
  )

  return (
    <PublicLayout
      headerContent={<Heading size={'h2'}>{m.page_identifier_title()}</Heading>}
    >
      {identifier.password && identifier.password !== password ? (
        <div className="w-full pt-12">
          <div className="border-border bg-main flex w-full flex-col gap-6 border-2 sm:p-8 shadow-shadow xl:flex-row xl:items-center xl:justify-between">
            <div className="max-w-xl space-y-2 p-8">
              <Heading size={'h3'}>{identifier.title}</Heading>
              <p className="text-foreground/70 text-sm">
                {m.component_view_password_restricted_description({
                  model: m.model_identifier_title(),
                })}
              </p>
            </div>
            <div className="p-3 w-full sm:p-0">
              <PublicAccessPasswordForm
                form={form}
                onSubmit={onSubmit}
                isPending={isPending}
                cancelTo={'/{-$locale}/$username/identifier'}
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          <PublicIdentifierView identifier={identifier} />
          <PublicUrlListSection
            urls={urls}
            isUrlsLoading={isUrlsLoading}
            queryParams={queryParams}
            handleUpdateQuery={handleUpdateQuery}
          />
        </>
      )}
    </PublicLayout>
  )
}
