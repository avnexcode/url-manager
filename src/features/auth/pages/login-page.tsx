import { PageContainer, SectionContainer } from '@/components/layouts'
import { LoginForm } from '../forms'
import { useLogin } from '../hooks'

export const LoginPage = () => {
  const { form, onSubmit, isPending } = useLogin()

  return (
    <PageContainer>
      <SectionContainer className="flex min-h-screen items-center justify-center">
        <LoginForm form={form} onSubmit={onSubmit} isPending={isPending} />
      </SectionContainer>
    </PageContainer>
  )
}
