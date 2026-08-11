import type { z } from 'zod'
import type { loginFormSchema, registerFormSchema } from '../schemas'

export type RegisterFormSchema = z.infer<typeof registerFormSchema>
export type LoginFormSchema = z.infer<typeof loginFormSchema>
