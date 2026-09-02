import type { LoginProvider } from '@/generated/prisma/enums'
import { SUPABASE_BUCKET } from '@/lib/supabase/bucket'
import type { DBClient } from '@/server/db'
import { FileService } from '@/server/services'
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
import { createUserRequest } from './user.validation'

export class UserService extends CommonService {
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
    request: CreateUserRequest,
  ): Promise<CreateUserResponse> => {
    const { id, email } = request

    const validatedRequest = createUserRequest.parse(request)

    const username = generateUsernameFromEmail({ email })

    return await db.$transaction(async (tx) => {
      const user = await Repository.insert(tx, username, validatedRequest)

      await SettingService.create(tx, { userId: id })

      await DummyService.init(tx, id)

      return user
    })
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

    return user
  }

  static delete = async (
    db: DBClient,
    request: DeleteUserRequest,
  ): Promise<DeleteUserResponse> => {
    const { id } = request

    await this.checkUserExists(db, id)

    const platformIds = await PlatformService.getIdsByUser(db, id)

    const identifierIds = await IdentifierService.getIdsByUser(db, id)

    const { user, imageUrls } = await db.$transaction(async (tx) => {
      await SettingService.delete(tx, { userId: id })

      const { imageUrls: platformImageUrls } =
        await PlatformService.deleteManyCore(tx, id, platformIds)

      const { imageUrls: identifierImageUrls } =
        await IdentifierService.deleteManyCore(tx, id, identifierIds)

      const userData = await Repository.destroy(tx, request)

      return {
        user: userData,
        imageUrls: this.file.mergeImageUrlsByBucket(
          platformImageUrls,
          identifierImageUrls,
        ),
      }
    })

    const userImages = [user.image, user.avatar].filter(Boolean) as string[]

    const allImageUrls = this.file.mergeImageUrlsByBucket(
      imageUrls,
      userImages.length ? { [this.bucket]: userImages } : {},
    )

    console.log({ allImageUrls })

    await this.file.deleteImagesByBucket(allImageUrls)

    return user
  }
}
