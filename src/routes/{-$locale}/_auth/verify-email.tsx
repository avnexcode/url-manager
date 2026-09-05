import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { VerifyEmailPage } from '@/features/auth/pages'

const verifyEmailSearchSchema = z.object({
  email: z.string().optional(),
  cooldown: z
    .union([z.boolean(), z.enum(['true', 'false'])])
    .optional()
    .transform((val) => val === true || val === 'true'),
})
export const Route = createFileRoute('/{-$locale}/_auth/verify-email')({
  validateSearch: verifyEmailSearchSchema,
  component: VerifyEmailPage,
})
