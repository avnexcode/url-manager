import {
  AuthService,
  registerRequest,
  updatePasswordRequest,
} from '@/server/features/auth'
import type { UpdateUserResponse, UserResponse } from '@/server/features/user'
import { updateUserRequest, UserService } from '@/server/features/user'
import { errorFilter } from '@/server/filters'
import z from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(z.object({ request: registerRequest }))
    .mutation(async ({ ctx, input }): Promise<void> => {
      const { db } = ctx
      const { request } = input
      try {
        await db.$transaction(async (tx) => {
          await AuthService.register(tx, request)
        })
      } catch (error) {
        return errorFilter(error)
      }
    }),

  getAccount: protectedProcedure.query(
    async ({ ctx }): Promise<UserResponse> => {
      const { auth, db } = ctx
      try {
        const account = await UserService.getById(db, auth.id)
        return account
      } catch (error) {
        return errorFilter(error)
      }
    },
  ),

  updateAccount: protectedProcedure
    .input(z.object({ request: updateUserRequest }))
    .mutation(async ({ ctx, input }): Promise<UpdateUserResponse> => {
      const { auth, db } = ctx
      const { request } = input
      try {
        const account = await UserService.update(db, auth.id, request)
        return account
      } catch (error) {
        return errorFilter(error)
      }
    }),

  updatePassword: protectedProcedure
    .input(z.object({ request: updatePasswordRequest }))
    .mutation(async ({ ctx, input }): Promise<UpdateUserResponse> => {
      const { auth, db } = ctx
      const { request } = input
      try {
        const user = await AuthService.updatePassword(db, auth.id, request)
        return user
      } catch (error) {
        return errorFilter(error)
      }
    }),
})
