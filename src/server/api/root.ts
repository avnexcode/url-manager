import { authRouter, settingRouter } from './routers'
import { createTRPCRouter } from './trpc'

export const appRouter = createTRPCRouter({
  auth: authRouter,
  setting: settingRouter,
})

export type AppRouter = typeof appRouter
