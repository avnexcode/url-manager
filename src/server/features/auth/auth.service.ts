import type { LoginProvider } from '@/generated/prisma/enums'
import { createSSRClient } from '@/lib/supabase/server'
import type { DBClient } from '@/server/db'
import { SupabaseService } from '@/server/services'
import { capitalizeSentence } from '@/utils'
import type { User } from '@supabase/supabase-js'
import { CommonService } from '../common'
import type {
  CreateUserResponse,
  DeleteUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
} from '../user'
import { UserRepository, UserService } from '../user'
import type {
  AppMetadata,
  DeleteAccountRequest,
  RegisterRequest,
  UpdatePasswordRequest,
  UserMetadata,
} from './auth.model'

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

  private static checkIsValidCredentials = async (
    email: string,
    password: string,
  ) => {
    const supabase = createSSRClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      this.newError({
        code: 'BAD_REQUEST',
        message: this.m.error_message_supabase_auth_invalid_credentials(),
      })
    }
  }

  private static checkUserExists = async (
    db: DBClient,
    key: 'EMAIL' | 'SOME',
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

    const res = await this.auth.createUser({ email, password })

    const userId = res.userId

    try {
      const user = await UserService.create(db, {
        id: userId,
        email,
        provider: 'CREDENTIALS',
      })

      try {
        await this.auth.updateUsername(userId, user.username)

        await this.auth.emailVerification(email)
      } catch (postCommitError) {
        console.error('post-register side effect failed', postCommitError)
      }

      return user
    } catch (error) {
      try {
        await this.auth.deleteUser(userId)
      } catch (cleanupError) {
        console.error(
          'failed to cleanup auth user after failed registration',
          cleanupError,
        )
      }
      throw error
    }
  }

  static registerOAuth = async (
    db: DBClient,
    user: User,
  ): Promise<CreateUserResponse | UpdateUserResponse> => {
    const userMetadata = user.user_metadata as UserMetadata
    const appMetadata = user.app_metadata as AppMetadata
    const avatar = userMetadata.avatar_url ?? userMetadata.picture ?? ''

    const currentUser = await UserRepository.findById(db, user.id)

    if (!currentUser) {
      try {
        const newUser = await UserService.create(db, {
          id: user.id,
          email: user.email!,
          provider: 'GOOGLE',
          avatar,
        })

        try {
          await this.auth.updateUsername(user.id, newUser.username)
        } catch (error) {
          console.error('failed to sync username after oauth register', error)
        }

        return newUser
      } catch (error) {
        try {
          await this.auth.deleteUser(user.id)
        } catch (cleanupError) {
          console.error(
            'failed to cleanup auth user after failed oauth registration',
            cleanupError,
          )
        }
        throw error
      }
    }

    const { username, providers } = currentUser

    await this.auth.updateUsername(user.id, username)

    const isProviderExists = appMetadata.providers.every((provider) =>
      providers.includes(provider.toLocaleUpperCase() as LoginProvider),
    )

    if (!isProviderExists) {
      return await UserService.update(db, user.id, {
        avatar,
        provider: 'GOOGLE',
      })
    }

    return { ...currentUser, avatar }
  }

  static updateAccount = async (
    db: DBClient,
    userId: string,
    request: UpdateUserRequest,
  ): Promise<UpdateUserResponse> => {
    const user = await UserService.update(db, userId, request)

    try {
      await this.auth.updateUsername(userId, user.username)
    } catch (error) {
      console.error(
        'failed to sync username to supabase auth after account update',
        error,
      )
    }

    return user
  }

  static updatePassword = async (
    db: DBClient,
    userId: string,
    request: UpdatePasswordRequest,
  ): Promise<UpdateUserResponse> => {
    const { currentPassword, password, confirmPassword } = request

    this.checkIsPasswordMatch(password, confirmPassword)

    const { createdAt, ...user } = await UserService.getById(db, userId)

    const hasCredentials = user.providers.includes('CREDENTIALS')

    if (hasCredentials) {
      await this.checkIsValidCredentials(user.email, currentPassword!)
    }

    await this.auth.updatePassword(userId, password)

    if (!hasCredentials) {
      try {
        await UserService.update(db, userId, { provider: 'CREDENTIALS' })
      } catch (error) {
        console.error(
          'failed to sync CREDENTIALS provider after password set',
          error,
        )
      }
    }

    return user
  }

  static deleteAccount = async (
    db: DBClient,
    userId: string,
    request: DeleteAccountRequest,
  ): Promise<DeleteUserResponse> => {
    const { password } = request

    const { email } = await UserService.getById(db, userId)

    await this.checkIsValidCredentials(email, password)

    const user = await UserService.delete(db, { id: userId })

    try {
      await this.auth.deleteUser(userId)
    } catch (error) {
      console.error('failed to delete supabase auth user', error)
    }

    return user
  }
}
