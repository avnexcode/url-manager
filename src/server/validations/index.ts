import { z } from 'zod'

export const queryParams = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(500).default(15),
  search: z.string().trim().optional().default(''),
  sort: z
    .array(z.object({ id: z.string(), desc: z.boolean() }))
    .default([{ id: 'createdAt', desc: true }]),
})

export * from './enum.validation'
