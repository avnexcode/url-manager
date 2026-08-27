import { Heading } from '@/components'
import {
  MainLayout,
  PageContainer,
  SectionContainer,
} from '@/components/layouts'
import { useAuth } from '@/hooks'
import * as m from '@/generated/paraglide/messages'

import { useUpdateAccount } from '../../auth/hooks'
import { EditAccountForm } from '../forms'

export const AccountPage = () => {
  const { user } = useAuth()

  const { form, onSubmit, hasChanges, isPending } = useUpdateAccount(user)

  return (
    <PageContainer withHeader withFooter>
      <SectionContainer container padded className="min-h-screen">
        <MainLayout
          headerContent={
            <Heading size={'h2'}>{m.page_auth_account_title()}</Heading>
          }
          className="space-y-5"
        >
          <EditAccountForm
            form={form}
            onSubmit={onSubmit}
            hasChanges={hasChanges}
            isPending={isPending}
            email={user.email}
            image={user.image}
            avatar={user.avatar}
          />
        </MainLayout>
      </SectionContainer>
    </PageContainer>
  )
}
