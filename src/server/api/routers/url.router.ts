import type { QueryResponse } from '@/interfaces'
import type {
  BulkDeleteUrlsResponse,
  CreateUrlResponse,
  DeleteUrlResponse,
  PublicUrlResponse,
  UpdateUrlResponse,
  UrlResponse,
} from '@/server/features/url'
import {
  bulkDeleteUrlsRequest,
  createUrlRequest,
  deleteUrlRequest,
  publicRelationParams,
  relationParams,
  updateUrlRequest,
  UrlService,
} from '@/server/features/url'
import { errorFilter } from '@/server/filters'
import { queryParams } from '@/server/validations'
import z from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

export const urlRouter = createTRPCRouter({
  getPublicAll: publicProcedure
    .input(
      z.object({
        username: z.string(),
        relation: publicRelationParams,
        params: queryParams,
      }),
    )
    .query(
      async ({ ctx, input }): Promise<QueryResponse<PublicUrlResponse>> => {
        const { db } = ctx
        const { username, relation, params } = input
        try {
          const urls = await UrlService.getPublicAll(
            db,
            username,
            relation,
            params,
          )
          return urls
        } catch (error) {
          return errorFilter(error)
        }
      },
    ),

  getPublicBySlugSuffix: publicProcedure
    .input(z.object({ suffix: z.string() }))
    .query(async ({ ctx, input }): Promise<PublicUrlResponse> => {
      const { db } = ctx
      const { suffix } = input
      try {
        const url = await UrlService.getPublicBySlugSuffix(db, suffix)
        return url
      } catch (error) {
        return errorFilter(error)
      }
    }),

  getAll: protectedProcedure
    .input(z.object({ relation: relationParams, params: queryParams }))
    .query(async ({ ctx, input }): Promise<QueryResponse<UrlResponse>> => {
      const { auth, db } = ctx
      const { relation, params } = input
      try {
        const urls = await UrlService.getAll(db, auth.id, relation, params)
        return urls
      } catch (error) {
        return errorFilter(error)
      }
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.uuid() }))
    .query(async ({ ctx, input }): Promise<UrlResponse> => {
      const { auth, db } = ctx
      const { id } = input
      try {
        const url = await UrlService.getById(db, auth.id, id)
        return url
      } catch (error) {
        return errorFilter(error)
      }
    }),

  create: protectedProcedure
    .input(z.object({ request: createUrlRequest }))
    .mutation(async ({ ctx, input }): Promise<CreateUrlResponse> => {
      const { auth, db } = ctx
      const { request } = input
      try {
        return db.$transaction(async (tx) => {
          const url = await UrlService.create(tx, auth.id, request)
          return url
        })
      } catch (error) {
        return errorFilter(error)
      }
    }),

  update: protectedProcedure
    .input(z.object({ id: z.uuid(), request: updateUrlRequest }))
    .mutation(async ({ ctx, input }): Promise<UpdateUrlResponse> => {
      const { auth, db } = ctx
      const { id, request } = input
      try {
        const url = await UrlService.update(db, id, auth.id, request)
        return url
      } catch (error) {
        return errorFilter(error)
      }
    }),

  delete: protectedProcedure
    .input(z.object({ request: deleteUrlRequest }))
    .mutation(async ({ ctx, input }): Promise<DeleteUrlResponse> => {
      const { auth, db } = ctx
      const { request } = input
      try {
        return await db.$transaction(async (tx) => {
          const url = await UrlService.delete(tx, auth.id, request)
          return url
        })
      } catch (error) {
        return errorFilter(error)
      }
    }),

  deleteMany: protectedProcedure
    .input(z.object({ request: bulkDeleteUrlsRequest }))
    .mutation(async ({ ctx, input }): Promise<BulkDeleteUrlsResponse> => {
      const { auth, db } = ctx
      const { request } = input
      try {
        return await db.$transaction(async (tx) => {
          const url = await UrlService.deleteMany(tx, auth.id, request)
          return url
        })
      } catch (error) {
        return errorFilter(error)
      }
    }),
})
