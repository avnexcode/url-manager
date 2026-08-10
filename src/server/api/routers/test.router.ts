import { createTRPCRouter, publicProcedure } from '../trpc'

export const testRouter = createTRPCRouter({
  test: publicProcedure.query(async () => {
    return { message: 'Test TRPC' }
  }),
})
