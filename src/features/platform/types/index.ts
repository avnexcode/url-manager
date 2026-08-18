import type z from 'zod'
import type {
  createPlatformFormSchema,
  updatePlatformFormSchema,
} from '../schemas'

export type CreatePlatformFormSchema = z.infer<typeof createPlatformFormSchema>
export type UpdatePlatformFormSchema = z.infer<typeof updatePlatformFormSchema>
