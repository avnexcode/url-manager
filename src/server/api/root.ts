import { testRouter } from './routers/test.router'
import { createTRPCRouter } from './trpc'

export const appRouter = createTRPCRouter({
  test: testRouter,
})

export type AppRouter = typeof appRouter
