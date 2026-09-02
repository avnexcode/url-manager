import { LoginForm } from '../forms'
import { useLogin } from '../hooks'

export const LoginPage = () => {
  const { form, onSubmit, isPending } = useLogin()

  return <LoginForm form={form} onSubmit={onSubmit} isPending={isPending} />
}
