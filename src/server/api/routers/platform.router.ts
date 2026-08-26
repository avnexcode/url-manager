import type { QueryResponse } from '@/interfaces'
import type {
  BulkDeletePlatformsResponse,
  CreatePlatformResponse,
  DeletePlatformResponse,
  PlatformResponse,
  PublicPlatformResponse,
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
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

export const platformRouter = createTRPCRouter({
  getPubllicAll: publicProcedure
    .input(z.object({ username: z.string(), params: queryParams }))
    .query(
      async ({
        ctx,
        input,
      }): Promise<QueryResponse<PublicPlatformResponse>> => {
        const { db } = ctx
        const { username, params } = input
        try {
          const platforms = await PlatformService.getPublicAll(
            db,
            username,
            params,
          )
          return platforms
        } catch (error) {
          return errorFilter(error)
        }
      },
    ),

  getPublicBySlug: publicProcedure
    .input(z.object({ username: z.string().min(1), slug: z.string().min(1) }))
    .query(async ({ ctx, input }): Promise<PublicPlatformResponse> => {
      const { db } = ctx
      const { username, slug } = input
      try {
        const platform = await PlatformService.getPublicBySlug(
          db,
          username,
          slug,
        )
        return platform
      } catch (error) {
        return errorFilter(error)
      }
    }),

  getPublicBySlugSuffix: publicProcedure
    .input(z.object({ suffix: z.string().min(1) }))
    .query(async ({ ctx, input }): Promise<PublicPlatformResponse> => {
      const { db } = ctx
      const { suffix } = input
      try {
        const platform = await PlatformService.getPublicBySlugSuffix(db, suffix)
        return platform
      } catch (error) {
        return errorFilter(error)
      }
    }),

  getPublicAccessPassword: publicProcedure
    .input(
      z.object({
        request: z.object({
          username: z.string().min(1),
          slug: z.string().min(1),
          password: z.string().min(1),
        }),
      }),
    )
    .mutation(async ({ ctx, input }): Promise<{ redirectUrl: string }> => {
      const { db } = ctx
      const { request } = input
      const { username, slug, password } = request
      try {
        const response = await PlatformService.getPublicAccessPassword(
          db,
          username,
          slug,
          password,
        )
        return response
      } catch (error) {
        return errorFilter(error)
      }
    }),

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
