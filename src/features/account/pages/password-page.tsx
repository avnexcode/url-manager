import { Heading } from '@/components'
import {
  MainLayout,
  PageContainer,
  SectionContainer,
} from '@/components/layouts'
import * as m from '@/generated/paraglide/messages'
import { useAuth } from '@/hooks'
import { EditPasswordForm } from '../forms'
import { useUpdatePassword } from '../hooks/use-update-password'

export const AccountPage = () => {
  const { user } = useAuth()
  const { form, onSubmit, isPending } = useUpdatePassword(user?.providers)

  return (
    <PageContainer withHeader withFooter>
      <SectionContainer container padded className="min-h-screen">
        <MainLayout
          headerContent={
            <Heading size={'h2'}>{m.page_auth_account_title()}</Heading>
          }
          className="space-y-15 flex gap-x-5 flex-col xl:flex-row"
        >
          <EditPasswordForm
            form={form}
            onSubmit={onSubmit}
            isPending={isPending}
            providers={user?.providers ?? []}
          />
        </MainLayout>
      </SectionContainer>
    </PageContainer>
  )
}
