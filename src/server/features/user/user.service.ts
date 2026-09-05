import type { LoginProvider } from '@/generated/prisma/enums'
import { SUPABASE_BUCKET } from '@/lib/supabase/bucket'
import type { DBClient } from '@/server/db'
import { FileService } from '@/server/services'
import { generateUsernameFromEmail } from '@/utils'
import { CommonService } from '../common'
import { IdentifierService } from '../identifier'
import { PlatformService } from '../platform'
import { SettingService } from '../settings'
import { UrlService } from '../url'
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
import { createUserRequest, updateUserRequest } from './user.validation'

export class UserService extends CommonService {
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
    request: CreateUserRequest,
  ): Promise<CreateUserResponse> => {
    const { id, email } = request

    const validatedRequest = createUserRequest.parse(request)

    const username = generateUsernameFromEmail({ email })

    return await db.$transaction(async (tx) => {
      const user = await Repository.insert(tx, username, validatedRequest)

      await SettingService.create(tx, { userId: id })

      return user
    })
  }

  static update = async (
    db: DBClient,
    id: string,
    request: UpdateUserRequest,
  ): Promise<UpdateUserResponse> => {
    const validatedRequest = updateUserRequest.parse(request)

    const { username, provider } = validatedRequest

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

    return user
  }

  static deleteRelationUser = async (db: DBClient, userId: string) => {
    await SettingService.delete(db, { userId })

    const platformIds = await PlatformService.getIdsByUser(db, userId)

    const { imageUrls: platformImageUrls } =
      await PlatformService.deleteManyCore(db, userId, platformIds)

    const identifierIds = await IdentifierService.getIdsByUser(db, userId)

    const { imageUrls: identifierImageUrls } =
      await IdentifierService.deleteManyCore(db, userId, identifierIds)

    const urlIds = await UrlService.getIdsByUser(db, userId)

    const { imageUrls: urlImageUrls } = await UrlService.deleteManyCore(
      db,
      userId,
      urlIds,
    )

    return {
      imageUrls: FileService.mergeImageUrlsByBucket(
        platformImageUrls,
        identifierImageUrls,
        urlImageUrls,
      ),
    }
  }

  static delete = async (
    db: DBClient,
    request: DeleteUserRequest,
  ): Promise<DeleteUserResponse> => {
    const { id } = request

    await this.checkUserExists(db, id)

    const { user, imageUrls } = await db.$transaction(async (tx) => {
      const { imageUrls: relationImageUrls } = await this.deleteRelationUser(
        tx,
        id,
      )

      const userData = await Repository.destroy(tx, request)

      return { user: userData, imageUrls: relationImageUrls }
    })

    const userImages = [user.image, user.avatar].filter(Boolean) as string[]

    const allImageUrls = FileService.mergeImageUrlsByBucket(
      imageUrls,
      userImages.length ? { [SUPABASE_BUCKET.Profile]: userImages } : {},
    )

    await FileService.deleteImagesByBucket(allImageUrls)

    return user
  }
}
