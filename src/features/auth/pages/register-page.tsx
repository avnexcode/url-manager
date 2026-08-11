import { PageContainer, SectionContainer } from '@/components/layouts'
import { RegisterForm } from '../forms'
import { useRegister } from '../hooks'

export const RegisterPage = () => {
  const { form, onSubmit, isPending } = useRegister()

  return (
    <PageContainer>
      <SectionContainer className="flex min-h-screen items-center justify-center">
        <RegisterForm form={form} onSubmit={onSubmit} isPending={isPending} />
      </SectionContainer>
    </PageContainer>
  )
}
