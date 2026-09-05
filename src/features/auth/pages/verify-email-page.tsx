import { Route } from '@/routes/{-$locale}/_auth/verify-email'
import { EmailVerificationForm } from '../forms'

export const VerifyEmailPage = () => {
  const { email, cooldown } = Route.useSearch()

  return (
    <EmailVerificationForm
      withInput={!email}
      email={email}
      autoCooldown={cooldown}
    />
  )
}
