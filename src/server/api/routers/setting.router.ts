import type {
  SettingResponse,
  UpdateSettingResponse,
} from '@/server/features/settings'
import {
  SettingService,
  updateSettingRequest,
} from '@/server/features/settings'
import { errorFilter } from '@/server/filters'
import z from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export const settingRouter = createTRPCRouter({
  getByUser: protectedProcedure.query(
    async ({ ctx }): Promise<SettingResponse> => {
      const { db, auth } = ctx
      try {
        const settings = await SettingService.getByUser(db, auth.id)
        return settings
      } catch (error) {
        return errorFilter(error)
      }
    },
  ),

  update: protectedProcedure
    .input(z.object({ request: updateSettingRequest }))
    .mutation(async ({ ctx, input }): Promise<UpdateSettingResponse> => {
      const { db, auth } = ctx
      const { request } = input
      try {
        const setting = await SettingService.update(db, auth.id, request)
        return setting
      } catch (error) {
        return errorFilter(error)
      }
    }),
})
