import { Heading } from '@/components'
import { MainLayout } from '@/components/layouts'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import * as m from '@/generated/paraglide/messages'
import { Route } from '@/routes/{-$locale}/_authenticated/dashboard/url/create'
import { useMemo, useState } from 'react'
import { CreateUrlForm } from '../forms'
import { useCreateUrl } from '../hooks'
import { getRedirectTo } from '../utils'

export const CreateUrlPage = () => {
  const [redirect, setRedirect] = useState<boolean>(true)

  const search = Route.useSearch()

  const { from, id } = search

  const redirectTo = useMemo(() => getRedirectTo(search), [search])

  const { form, onSubmit, isPending } = useCreateUrl(
    { redirect, redirectTo },
    { from, id },
  )

  return (
    <MainLayout
      headerContent={
        <>
          <Heading size={'h2'}>{m.page_url_title()}</Heading>
          <div className="flex items-center gap-2">
            <Switch
              id="redirect-toggle"
              checked={redirect}
              onCheckedChange={setRedirect}
            />
            <Label htmlFor="redirect-toggle">{m.action_redirect()}</Label>
          </div>
        </>
      }
    >
      <CreateUrlForm
        form={form}
        onSubmit={onSubmit}
        isPending={isPending}
        cancelTo={redirectTo}
      />
    </MainLayout>
  )
}
