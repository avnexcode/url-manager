import type {
  BulkDeleteIdentifiersResponse,
  CreateIdentifierResponse,
  DeleteIdentifierResponse,
  IdentifierResponse,
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
import { createTRPCRouter, protectedProcedure } from '../trpc'

export const identifierRouter = createTRPCRouter({
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
        return db.$transaction(async (tx) => {
          const identifier = await IdentifierService.create(
            tx,
            auth.id,
            request,
          )
          return identifier
        })
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
        return await db.$transaction(async (tx) => {
          const identifier = await IdentifierService.delete(
            tx,
            auth.id,
            request,
          )
          return identifier
        })
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
          return await db.$transaction(async (tx) => {
            const identifier = await IdentifierService.deleteMany(
              tx,
              auth.id,
              request,
            )
            return identifier
          })
        } catch (error) {
          return errorFilter(error)
        }
      },
    ),
})
