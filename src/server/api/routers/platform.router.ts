import type { QueryResponse } from '@/interfaces'
import type {
  BulkDeletePlatformsResponse,
  CreatePlatformResponse,
  DeletePlatformResponse,
  PlatformResponse,
  UpdatePlatformResponse,
} from '@/server/features/platform'
import {
  bulkDeletePlatformsRequest,
  createPlatformRequest,
  deletePlatformRequest,
  PlatformService,
  updatePlatformRequest,
} from '@/server/features/platform'
import { errorFilter } from '@/server/filters'
import { queryParams } from '@/server/validations'
import z from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export const platformRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({ params: queryParams }))
    .query(async ({ ctx, input }): Promise<QueryResponse<PlatformResponse>> => {
      const { auth, db } = ctx
      const { params } = input
      try {
        const platforms = await PlatformService.getAll(db, auth.id, params)
        return platforms
      } catch (error) {
        return errorFilter(error)
      }
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.uuid() }))
    .query(async ({ ctx, input }): Promise<PlatformResponse> => {
      const { auth, db } = ctx
      const { id } = input
      try {
        const platform = await PlatformService.getById(db, auth.id, id)
        return platform
      } catch (error) {
        return errorFilter(error)
      }
    }),

  create: protectedProcedure
    .input(z.object({ request: createPlatformRequest }))
    .mutation(async ({ ctx, input }): Promise<CreatePlatformResponse> => {
      const { auth, db } = ctx
      const { request } = input
      try {
        return db.$transaction(async (tx) => {
          const platform = await PlatformService.create(tx, auth.id, request)
          return platform
        })
      } catch (error) {
        return errorFilter(error)
      }
    }),

  update: protectedProcedure
    .input(z.object({ id: z.uuid(), request: updatePlatformRequest }))
    .mutation(async ({ ctx, input }): Promise<UpdatePlatformResponse> => {
      const { auth, db } = ctx
      const { id, request } = input
      try {
        const platform = await PlatformService.update(db, id, auth.id, request)
        return platform
      } catch (error) {
        return errorFilter(error)
      }
    }),

  delete: protectedProcedure
    .input(z.object({ request: deletePlatformRequest }))
    .mutation(async ({ ctx, input }): Promise<DeletePlatformResponse> => {
      const { auth, db } = ctx
      const { request } = input
      try {
        return await db.$transaction(async (tx) => {
          const platform = await PlatformService.delete(tx, auth.id, request)
          return platform
        })
      } catch (error) {
        return errorFilter(error)
      }
    }),

  deleteMany: protectedProcedure
    .input(z.object({ request: bulkDeletePlatformsRequest }))
    .mutation(async ({ ctx, input }): Promise<BulkDeletePlatformsResponse> => {
      const { auth, db } = ctx
      const { request } = input
      try {
        return await db.$transaction(async (tx) => {
          const platform = await PlatformService.deleteMany(
            tx,
            auth.id,
            request,
          )
          return platform
        })
      } catch (error) {
        return errorFilter(error)
      }
    }),
})
