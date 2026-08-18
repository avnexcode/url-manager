import { SUPABASE_BUCKET } from '@/lib/supabase/bucket'
import type { DBClient } from '@/server/db'
import { CommonService } from '../common'
import type {
  BulkDeleteUserRequest,
  BulkDeleteUserResponse,
  CreateUserRequest,
  CreateUserResponse,
  DeleteUserRequest,
  DeleteUserResponse,
  UserResponse,
} from './user.model'
import { UserRepository as Repository } from './user.repository'
import { SupabaseService } from '@/server/services/supabase.service'
import { SettingService } from '../settings'
import { FileService } from '@/server/services'

export class UserService extends CommonService {
  private static auth = SupabaseService.auth
  private static bucket = SUPABASE_BUCKET.Profile

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

  private static checkUsersExist = async (
    db: DBClient,
    ids: string[],
  ): Promise<void> => {
    const count = await Repository.countByIds(db, ids)

    this.checkExists(count !== ids.length)
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
    const username = 'user-' + id.split('-').pop()

    const user = await Repository.insert(db, id, username, request)

    await this.auth.updateUsername(id, username)

    return user
  }

  static delete = async (
    db: DBClient,
    request: DeleteUserRequest,
  ): Promise<DeleteUserResponse> => {
    const { id } = request

    await this.checkUserExists(db, id)

    await SettingService.deleteByUser(db, id)

    const user = await Repository.destroy(db, request)

    if (user.image) {
      await FileService.deleteImageByUrl(this.bucket, user.image)
    }

    return user
  }

  static deleteMany = async (
    db: DBClient,
    request: BulkDeleteUserRequest,
  ): Promise<BulkDeleteUserResponse> => {
    const { ids } = request

    await this.checkUsersExist(db, ids)

    await SettingService.deleteManyByUsers(db, ids)

    const users = await Repository.destroyMany(db, request)

    const imageUrls = users
      .map((user) => user.image)
      .filter((image): image is string => image !== null)

    if (imageUrls.length) {
      await FileService.deleteImageByUrls(this.bucket, imageUrls)
    }

    return users
  }
}
