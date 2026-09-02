import type {
  BulkDeleteIdentifiersResponse,
  CreateIdentifierResponse,
  DeleteIdentifierResponse,
  IdentifierResponse,
  PublicIdentifierResponse,
  UpdateIdentifierResponse,
} from '@/server/features/identifier'
import {
  bulkDeleteIdentifiersRequest,
  createIdentifierRequest,
  deleteIdentifierRequest,
  IdentifierService,
  updateIdentifierRequest,
} from '@/server/features/identifier'
import { errorFilter } from '@/server/filters'
import type { QueryResponse } from '@/server/interfaces'
import { queryParams } from '@/server/validations'
import z from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

export const identifierRouter = createTRPCRouter({
  getPubllicAll: publicProcedure
    .input(z.object({ username: z.string().min(1), params: queryParams }))
    .query(
      async ({
        ctx,
        input,
      }): Promise<QueryResponse<PublicIdentifierResponse>> => {
        const { db } = ctx
        const { username, params } = input
        try {
          const identifiers = await IdentifierService.getPublicAll(
            db,
            username,
            params,
          )
          return identifiers
        } catch (error) {
          return errorFilter(error)
        }
      },
    ),

  getPublicBySlug: publicProcedure
    .input(z.object({ username: z.string().min(1), slug: z.string().min(1) }))
    .query(async ({ ctx, input }): Promise<PublicIdentifierResponse> => {
      const { db } = ctx
      const { username, slug } = input
      try {
        const identifier = await IdentifierService.getPublicBySlug(
          db,
          username,
          slug,
        )
        return identifier
      } catch (error) {
        return errorFilter(error)
      }
    }),

  getPublicBySlugSuffix: publicProcedure
    .input(z.object({ suffix: z.string().min(8) }))
    .query(async ({ ctx, input }): Promise<PublicIdentifierResponse> => {
      const { db } = ctx
      const { suffix } = input
      try {
        const identifier = await IdentifierService.getPublicBySlugSuffix(
          db,
          suffix,
        )
        return identifier
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
        const response = await IdentifierService.getPublicAccessPassword(
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
    .query(
      async ({ ctx, input }): Promise<QueryResponse<IdentifierResponse>> => {
        const { auth, db } = ctx
        const { params } = input
        try {
          const identifiers = await IdentifierService.getAll(
            db,
            auth.id,
            params,
          )
          return identifiers
        } catch (error) {
          return errorFilter(error)
        }
      },
    ),

  getById: protectedProcedure
    .input(z.object({ id: z.uuid() }))
    .query(async ({ ctx, input }): Promise<IdentifierResponse> => {
      const { auth, db } = ctx
      const { id } = input
      try {
        const identifier = await IdentifierService.getById(db, auth.id, id)
        return identifier
      } catch (error) {
        return errorFilter(error)
      }
    }),

  create: protectedProcedure
    .input(z.object({ request: createIdentifierRequest }))
    .mutation(async ({ ctx, input }): Promise<CreateIdentifierResponse> => {
      const { auth, db } = ctx
      const { request } = input
      try {
        const identifier = await IdentifierService.create(db, auth.id, request)
        return identifier
      } catch (error) {
        return errorFilter(error)
      }
    }),

  update: protectedProcedure
    .input(z.object({ id: z.uuid(), request: updateIdentifierRequest }))
    .mutation(async ({ ctx, input }): Promise<UpdateIdentifierResponse> => {
      const { auth, db } = ctx
      const { id, request } = input
      try {
        const identifier = await IdentifierService.update(
          db,
          id,
          auth.id,
          request,
        )
        return identifier
      } catch (error) {
        return errorFilter(error)
      }
    }),

  delete: protectedProcedure
    .input(z.object({ request: deleteIdentifierRequest }))
    .mutation(async ({ ctx, input }): Promise<DeleteIdentifierResponse> => {
      const { auth, db } = ctx
      const { request } = input
      try {
        const identifier = await IdentifierService.delete(db, auth.id, request)
        return identifier
      } catch (error) {
        return errorFilter(error)
      }
    }),

  deleteMany: protectedProcedure
    .input(z.object({ request: bulkDeleteIdentifiersRequest }))
    .mutation(
      async ({ ctx, input }): Promise<BulkDeleteIdentifiersResponse> => {
        const { auth, db } = ctx
        const { request } = input
        try {
          const identifier = await IdentifierService.deleteMany(
            db,
            auth.id,
            request,
          )
          return identifier
        } catch (error) {
          return errorFilter(error)
        }
      },
    ),
})
