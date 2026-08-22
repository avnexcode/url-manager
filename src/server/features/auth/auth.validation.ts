import { z } from 'zod'

export const passwordValidation = z
  .string()
  .min(1)
  .min(8)
  .max(150)
  .regex(/[a-z]/)
  .regex(/[A-Z]/)
  .regex(/\d/)
  .regex(/[@$!%*?&]/)

export const emailValidation = z.email().min(1).max(150).trim().toLowerCase()

export const phoneValidation = z
  .string()
  .min(1)
  .min(8)
  .max(15)
  .regex(/^\d+$/)
  .or(z.literal(''))

export const registerRequest = z
  .object({
    email: emailValidation,
    password: passwordValidation,
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
  })

export const loginRequest = z.object({
  email: emailValidation,
  password: z.string().min(1),
})

export const updateEmailRequest = z.object({
  email: emailValidation,
  password: z.string().min(1),
})

export const updatePasswordRequest = z
  .object({
    // currentPassword: z.string().min(1),
    password: passwordValidation,
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
  })

export const resetPasswordRequest = z
  .object({
    password: passwordValidation,
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
  })

export const deleteAccountRequest = z.object({
  password: z.string().min(1),
})
