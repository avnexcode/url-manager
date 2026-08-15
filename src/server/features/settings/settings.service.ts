import type { DBClient } from '@/server/db'
import { SupabaseService } from '@/server/services'
import { CommonService } from '../common'
import type {
  BulkDeleteSettingRequest,
  BulkDeleteSettingResponse,
  CreateSettingRequest,
  CreateSettingResponse,
  DeleteSettingRequest,
  DeleteSettingResponse,
  SettingResponse,
  UpdateSettingRequest,
  UpdateSettingResponse,
} from './settings.model'
import { SettingRepository as Repository } from './settings.repository'

export class SettingService extends CommonService {
  private static auth = SupabaseService.auth

  protected static override get baseModel() {
    return this.m('model_setting_title')
  }

  private static checkSettingExists = async (
    db: DBClient,
    id: string,
  ): Promise<void> => {
    const count = await Repository.countById(db, id)

    this.checkExists(count === 0)
  }

  private static checkSettingByUserExists = async (
    db: DBClient,
    userId: string,
  ): Promise<void> => {
    const count = await Repository.countByUser(db, userId)

    this.checkExists(count === 0)
  }

  private static checkSettingsExist = async (
    db: DBClient,
    ids: string[],
  ): Promise<void> => {
    const count = await Repository.countByIds(db, ids)

    this.checkExists(count !== ids.length)
  }

  static getByUser = async (
    db: DBClient,
    userId: string,
  ): Promise<SettingResponse> => {
    const settings = await Repository.findByUser(db, userId)

    return this.checkNotNull(settings)
  }

  private static getIdsByUsers = async (
    db: DBClient,
    userIds: string[],
  ): Promise<string[]> => {
    if (!userIds.length) return []

    const settings = await Repository.findIdsByUsers(db, userIds)

    return settings.map((setting) => setting.id)
  }

  static getIdByUser = async (
    db: DBClient,
    userId: string,
  ): Promise<{ id: string }> => {
    const settings = await Repository.findIdByUser(db, userId)

    return this.checkNotNull(settings)
  }

  static create = async (
    db: DBClient,
    request: CreateSettingRequest,
  ): Promise<CreateSettingResponse> => {
    const settings = await Repository.insert(db, request)

    return settings
  }

  static updateByUser = async (
    db: DBClient,
    userId: string,
    id: string,
    request: UpdateSettingRequest,
  ): Promise<UpdateSettingResponse> => {
    const { language } = request

    await this.checkSettingByUserExists(db, userId)

    const settings = await Repository.updateByUser(db, userId, id, request)

    if (language) {
      await this.auth.updateLanguage(userId, language)
    }

    return settings
  }

  private static delete = async (
    db: DBClient,
    request: DeleteSettingRequest,
  ): Promise<DeleteSettingResponse> => {
    const { id } = request

    await this.checkSettingExists(db, id)

    const settings = await Repository.destroy(db, request)

    return settings
  }

  static deleteByUser = async (
    db: DBClient,
    userId: string,
  ): Promise<DeleteSettingResponse> => {
    const { id } = await this.getIdByUser(db, userId)

    const settings = await this.delete(db, { id })

    return settings
  }

  private static deleteMany = async (
    db: DBClient,
    request: BulkDeleteSettingRequest,
  ): Promise<BulkDeleteSettingResponse> => {
    const { ids } = request

    await this.checkSettingsExist(db, ids)

    const settings = await Repository.destroyMany(db, request)

    return settings
  }

  static deleteManyByUsers = async (
    db: DBClient,
    userIds: string[],
  ): Promise<BulkDeleteSettingResponse> => {
    const ids = await this.getIdsByUsers(db, userIds)

    const settings = await this.deleteMany(db, { ids })

    return settings
  }
}
