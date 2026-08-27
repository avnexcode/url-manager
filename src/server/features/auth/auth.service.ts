import type { DBClient } from '@/server/db'
import { SupabaseService } from '@/server/services'
import { capitalizeSentence } from '@/utils'
import { CommonService } from '../common'
import { SettingService } from '../settings'
import type { CreateUserResponse, UpdateUserResponse } from '../user'
import { UserRepository, UserService } from '../user'
import type { RegisterRequest, UpdatePasswordRequest } from './auth.model'

export class AuthService extends CommonService {
  private static auth = SupabaseService.auth

  private static checkIsPasswordMatch = (
    password: string,
    confirmPassword: string,
  ) => {
    if (password !== confirmPassword) {
      this.newError({
        code: 'BAD_REQUEST',
        message: capitalizeSentence(
          this.m.schema_validation_password_confirm_password_do_not_match(),
        ),
      })
    }
  }

  private static checkUserExists = async (
    db: DBClient,
    key: 'EMAIL' | '',
    value: string,
  ) => {
    if (key === 'EMAIL') {
      const count = await UserRepository.countByEmail(db, value)

      this.checkExists(count !== 0, 'CONFLICT', this.m.model_auth_field_email())
    }
  }

  static register = async (
    db: DBClient,
    request: RegisterRequest,
  ): Promise<CreateUserResponse> => {
    const { email, password, confirmPassword } = request

    this.checkIsPasswordMatch(password, confirmPassword)

    await this.checkUserExists(db, 'EMAIL', email)

    let userId = ''

    try {
      const res = await this.auth.createUser({ email, password })

      if (res.userId) userId = res.userId

      const user = await UserService.create(db, userId, {
        email,
        provider: 'CREDENTIALS',
      })

      await SettingService.create(db, { userId })

      await this.auth.emailVerification(email)

      return user
    } catch (error) {
      if (userId) await this.auth.deleteUser(userId)

      throw error
    }
  }

  static registerOAuth = async (
    db: DBClient,
    userId: string,
    email: string,
  ): Promise<CreateUserResponse> => {
    try {
      const user = await UserService.create(db, userId, {
        email,
        provider: 'GOOGLE',
      })

      await SettingService.create(db, { userId })

      await this.auth.updateUsername(userId, user.username)
      await this.auth.updateLanguage(userId, 'ID')

      return user
    } catch (error) {
      if (userId) await this.deleteUser(db, userId)

      throw error
    }
  }

  static updatePassword = async (
    db: DBClient,
    userId: string,
    request: UpdatePasswordRequest,
  ): Promise<UpdateUserResponse> => {
    const { password, confirmPassword } = request

    const { createdAt, ...user } = await UserService.getById(db, userId)

    this.checkIsPasswordMatch(password, confirmPassword)

    await this.auth.updatePassword(userId, password)

    return user
  }

  static deleteUser = async (db: DBClient, id: string) => {
    await UserService.delete(db, { id })
    await this.auth.deleteUser(id)
  }
}
