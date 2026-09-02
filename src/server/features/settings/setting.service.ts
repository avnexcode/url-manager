import type { DBClient } from '@/server/db'
import { CommonService } from '../common'
import type {
  CreateSettingRequest,
  CreateSettingResponse,
  DeleteSettingRequest,
  DeleteSettingResponse,
  SettingResponse,
  UpdateSettingRequest,
  UpdateSettingResponse,
} from './setting.model'
import { SettingRepository as Repository } from './setting.repository'
import { createSettingRequest } from './setting.validation'

export class SettingService extends CommonService {
  protected static override get baseModel() {
    return this.m.model_setting_title()
  }

  private static checkSettingByUserExists = async (
    db: DBClient,
    userId: string,
  ): Promise<void> => {
    const count = await Repository.countByUser(db, userId)

    this.checkExists(count === 0)
  }

  static getByUser = async (
    db: DBClient,
    userId: string,
  ): Promise<SettingResponse> => {
    const setting = await Repository.findUniqueUser(db, userId)

    return this.checkNotNull(setting)
  }

  static getByUsername = async (
    db: DBClient,
    username: string,
  ): Promise<SettingResponse> => {
    const setting = await Repository.findUniqueUsername(db, username)

    return this.checkNotNull(setting)
  }

  static create = async (
    db: DBClient,
    request: CreateSettingRequest,
  ): Promise<CreateSettingResponse> => {
    const validatedRequest = createSettingRequest.parse(request)

    const setting = await Repository.insert(db, validatedRequest)

    return setting
  }

  static update = async (
    db: DBClient,
    userId: string,
    request: UpdateSettingRequest,
  ): Promise<UpdateSettingResponse> => {
    await this.checkSettingByUserExists(db, userId)

    const setting = await Repository.update(db, userId, request)

    return setting
  }

  static delete = async (
    db: DBClient,
    request: DeleteSettingRequest,
  ): Promise<DeleteSettingResponse> => {
    const { userId } = request

    await this.checkSettingByUserExists(db, userId)

    const setting = await Repository.destroy(db, request)

    return setting
  }
}
