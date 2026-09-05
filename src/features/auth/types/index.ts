import type { z } from 'zod'
import type { loginFormSchema, registerFormSchema } from '../schemas'

export type RegisterFormSchema = z.infer<ReturnType<typeof registerFormSchema>>

export type LoginFormSchema = z.infer<ReturnType<typeof loginFormSchema>>
