import type { DBClient } from '@/server/db'
import { CommonRepository } from '../common'
import type {
  CreateSettingRequest,
  CreateSettingResponse,
  DeleteSettingRequest,
  DeleteSettingResponse,
  SettingResponse,
  UpdateSettingRequest,
  UpdateSettingResponse,
} from './setting.model'

export class SettingRepository extends CommonRepository {
  static findUniqueUser = async (
    db: DBClient,
    userId: string,
  ): Promise<SettingResponse | null> => {
    const setting = await db.setting.findUnique({
      where: { userId },
      omit: { userId: true },
    })

    return setting
  }

  static findUniqueUsername = async (
    db: DBClient,
    username: string,
  ): Promise<SettingResponse | null> => {
    const setting = await db.setting.findFirst({
      where: { user: { username } },
      omit: { userId: true },
    })

    return setting
  }

  static countByUser = async (
    db: DBClient,
    userId: string,
  ): Promise<number> => {
    const count = await db.setting.count({ where: { userId } })

    return count
  }

  static insert = async (
    db: DBClient,
    request: CreateSettingRequest,
  ): Promise<CreateSettingResponse> => {
    const setting = await db.setting.create({
      data: request,
      omit: { userId: true, updatedAt: true },
    })

    return setting
  }

  static update = async (
    db: DBClient,
    userId: string,
    request: UpdateSettingRequest,
  ): Promise<UpdateSettingResponse> => {
    const setting = await db.setting.update({
      where: { userId },
      data: request,
      omit: { userId: true, createdAt: true },
    })

    return setting
  }

  static destroy = async (
    db: DBClient,
    request: DeleteSettingRequest,
  ): Promise<DeleteSettingResponse> => {
    const { userId } = request

    const setting = await db.setting.delete({
      where: { userId },
      select: { id: true },
    })

    return setting
  }
}
