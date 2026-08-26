import type { publicAccessPasswordFormSchema } from '@/schemas'
import type z from 'zod'

export type PublicAccessPasswordFormSchema = z.infer<
  typeof publicAccessPasswordFormSchema
>
