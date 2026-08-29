import type { LoginProvider } from '@/generated/prisma/enums'
import { SUPABASE_BUCKET } from '@/lib/supabase/bucket'
import type { DBClient } from '@/server/db'
import { FileService } from '@/server/services'
import { SupabaseService } from '@/server/services/supabase.service'
import { generateUsernameFromEmail } from '@/utils'
import { CommonService } from '../common'
import { DummyService } from '../dummy'
import { IdentifierService } from '../identifier'
import { PlatformService } from '../platform'
import { SettingService } from '../settings'
import type {
  CreateUserRequest,
  CreateUserResponse,
  DeleteUserRequest,
  DeleteUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  UserResponse,
} from './user.model'
import { UserRepository as Repository } from './user.repository'

export class UserService extends CommonService {
  private static auth = SupabaseService.auth
  private static bucket = SUPABASE_BUCKET.Profile
  private static file = FileService

  protected static override get baseModel() {
    return this.m.model_user_title()
  }

  private static checkUserExists = async (
    db: DBClient,
    id: string,
  ): Promise<void> => {
    const count = await Repository.countById(db, id)

    this.checkExists(count === 0)
  }

  static getById = async (db: DBClient, id: string): Promise<UserResponse> => {
    const user = await Repository.findById(db, id)

    return this.checkNotNull(user)
  }

  static create = async (
    db: DBClient,
    id: string,
    request: CreateUserRequest,
  ): Promise<CreateUserResponse> => {
    const { email } = request

    const username = generateUsernameFromEmail({ email })

    const user = await Repository.insert(db, id, username, request)

    await SettingService.create(db, { userId: id })

    await DummyService.init(db, id)

    await this.auth.updateUsername(id, username)

    return user
  }

  static update = async (
    db: DBClient,
    id: string,
    request: UpdateUserRequest,
  ): Promise<UpdateUserResponse> => {
    const { username, provider } = request

    const { username: oldUsername, providers } = await this.getById(db, id)

    const countUsername = await Repository.countByUsername(db, username ?? '')

    const conflict = countUsername !== 0 && username !== oldUsername

    this.checkExists(conflict, 'CONFLICT', this.m.model_user_field_username())

    const isProviderExists = provider
      ? providers.includes(provider.toLocaleUpperCase() as LoginProvider)
      : true

    let data = request

    if (isProviderExists) {
      data = { ...request, provider: undefined }
    }

    const user = await Repository.update(db, id, data)

    if (username) {
      await this.auth.updateUsername(id, username)
    }

    return user
  }

  static delete = async (
    db: DBClient,
    request: DeleteUserRequest,
  ): Promise<DeleteUserResponse> => {
    const { id } = request

    await this.checkUserExists(db, id)

    await SettingService.delete(db, { userId: id })

    const platformIds = await PlatformService.getIdsByUser(db, id)

    await PlatformService.deleteMany(db, id, { ids: platformIds })

    const identifierIds = await IdentifierService.getIdsByUser(db, id)

    await IdentifierService.deleteMany(db, id, { ids: identifierIds })

    const user = await Repository.destroy(db, request)

    const imageUrls = [user.image, user.avatar].filter(Boolean) as string[]

    if (imageUrls.length) {
      await this.file.deleteFileByUrls(this.bucket, imageUrls)
    }

    return user
  }
}
