import { Heading } from '@/components'
import { MainLayout } from '@/components/layouts'
import * as m from '@/generated/paraglide/messages'
import { useAuth } from '@/hooks'
import { DeleteAccountForm, EditAccountForm, EditPasswordForm } from '../forms'
import { useDeleteAccount } from '../hooks/use-delete-account'
import { useUpdatePassword } from '../hooks/use-update-password'
import { useUpdateAccount } from '../hooks'

export const AccountPage = () => {
  const { user } = useAuth()

  const { form, onSubmit, hasChanges, isPending } = useUpdateAccount(user)

  const {
    form: updatePasswordForm,
    onSubmit: onUpdatePasswordSubmit,
    isPending: isUpdatePasswordPending,
  } = useUpdatePassword(user.providers)

  const {
    form: deleteAccountForm,
    onSubmit: onDeleteAccountSubmit,
    isPending: isDeleteAccountPending,
  } = useDeleteAccount()

  return (
    <MainLayout
      headerContent={
        <Heading size={'h2'}>{m.page_auth_account_title()}</Heading>
      }
      className="space-y-25"
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
      <EditPasswordForm
        form={updatePasswordForm}
        onSubmit={onUpdatePasswordSubmit}
        isPending={isUpdatePasswordPending}
        providers={user.providers}
      />
      <DeleteAccountForm
        form={deleteAccountForm}
        onSubmit={onDeleteAccountSubmit}
        isPending={isDeleteAccountPending}
      />
    </MainLayout>
  )
}
