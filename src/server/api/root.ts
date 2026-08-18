import {
  authRouter,
  identifierRouter,
  platformRouter,
  settingRouter,
  urlRouter,
} from './routers'
import { createTRPCRouter } from './trpc'

export const appRouter = createTRPCRouter({
  auth: authRouter,
  setting: settingRouter,
  identifier: identifierRouter,
  platform: platformRouter,
  url: urlRouter,
})

export type AppRouter = typeof appRouter
