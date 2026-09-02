import {
  AuthService,
  deleteAccountRequest,
  registerRequest,
  updatePasswordRequest,
} from '@/server/features/auth'
import type {
  CreateUserResponse,
  DeleteUserResponse,
  UpdateUserResponse,
  UserResponse,
} from '@/server/features/user'
import { updateUserRequest, UserService } from '@/server/features/user'
import { errorFilter } from '@/server/filters'
import z from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(z.object({ request: registerRequest }))
    .mutation(async ({ ctx, input }): Promise<CreateUserResponse> => {
      const { db } = ctx
      const { request } = input
      try {
        const account = await AuthService.register(db, request)
        return account
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
        const account = await AuthService.updateAccount(db, auth.id, request)
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
        const account = await AuthService.updatePassword(db, auth.id, request)
        return account
      } catch (error) {
        return errorFilter(error)
      }
    }),

  deleteAccount: protectedProcedure
    .input(z.object({ request: deleteAccountRequest }))
    .mutation(async ({ ctx, input }): Promise<DeleteUserResponse> => {
      const { auth, db } = ctx
      const { request } = input
      try {
        const account = await AuthService.deleteAccount(db, auth.id, request)
        return account
      } catch (error) {
        return errorFilter(error)
      }
    }),
})
