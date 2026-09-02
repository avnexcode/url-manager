import { RegisterForm } from '../forms'
import { useRegister } from '../hooks'

export const RegisterPage = () => {
  const { form, onSubmit, isPending } = useRegister()

  return <RegisterForm form={form} onSubmit={onSubmit} isPending={isPending} />
}
