import type { QueryResponse } from '@/interfaces'
import { SUPABASE_BUCKET } from '@/lib/supabase/bucket'
import type { DBClient } from '@/server/db'
import type { QueryParams } from '@/server/models'
import { FileService } from '@/server/services'
import { generateSlug } from '@/utils'
import { randomUUID } from 'node:crypto'
import { CommonService } from '../common'
import type {
  BulkDeletePlatformsRequest,
  BulkDeletePlatformsResponse,
  CreatePlatformRequest,
  CreatePlatformResponse,
  DeletePlatformRequest,
  DeletePlatformResponse,
  PlatformResponse,
  UpdatePlatformRequest,
  UpdatePlatformResponse,
} from './platform.model'
import { PlatformRepository as Repository } from './platform.repository'

export class PlatformService extends CommonService {
  private static bucket = SUPABASE_BUCKET.Platform

  protected static override get baseModel() {
    return this.m.model_platform_title()
  }

  private static checkPlatformExists = async (
    db: DBClient,
    userId: string,
    id: string,
  ): Promise<void> => {
    const count = await Repository.countById(db, userId, id)

    this.checkExists(count === 0)
  }

  private static checkPlatformsExist = async (
    db: DBClient,
    userId: string,
    ids: string[],
  ): Promise<void> => {
    const count = await Repository.countByIds(db, userId, ids)

    this.checkExists(count !== ids.length)
  }

  private static checkConflict = async (
    db: DBClient,
    key: 'title' | 'slug',
    userId: string,
    value: string,
  ): Promise<void> => {
    if (key === 'title') {
      const count = await Repository.countByUserAndTitle(db, userId, value)

      this.checkExists(
        count !== 0,
        'CONFLICT',
        this.m.model_platform_field_title(),
      )
    }
  }

  static getAll = async (
    db: DBClient,
    userId: string,
    params: QueryParams,
  ): Promise<QueryResponse<PlatformResponse>> => {
    const { page, limit, search } = params

    const total = await Repository.countAll(db, userId, search)

    const data = await Repository.findMany(db, userId, params)

    const lastPage = Math.ceil(total / limit)

    return { data, meta: { total, limit, page, lastPage } }
  }

  static getById = async (
    db: DBClient,
    userId: string,
    id: string,
  ): Promise<PlatformResponse> => {
    const platform = await Repository.findById(db, userId, id)

    return this.checkNotNull(platform)
  }

  static create = async (
    db: DBClient,
    userId: string,
    request: CreatePlatformRequest,
  ): Promise<CreatePlatformResponse> => {
    const { title } = request

    const slug = generateSlug({ text: title, withId: true, uuid: randomUUID() })

    await this.checkConflict(db, 'title', userId, title)

    const platform = await Repository.insert(db, { userId, slug, ...request })

    return platform
  }

  static update = async (
    db: DBClient,
    id: string,
    userId: string,
    request: UpdatePlatformRequest,
  ): Promise<UpdatePlatformResponse> => {
    const { title } = request

    await this.checkPlatformExists(db, userId, id)

    const { title: oldTitle } = await this.getById(db, userId, id)

    const countTitle = await Repository.countByUserAndTitle(db, userId, title)

    const conflict = countTitle !== 0 && title !== oldTitle

    this.checkExists(conflict, 'CONFLICT', this.m.model_platform_field_title())

    const platform = await Repository.update(db, id, userId, request)

    return platform
  }

  static delete = async (
    db: DBClient,
    userId: string,
    request: DeletePlatformRequest,
  ): Promise<DeletePlatformResponse> => {
    const { id } = request

    await this.checkPlatformExists(db, userId, id)

    const platform = await Repository.destroy(db, userId, request)

    const imageUrls = [platform.thumbnail].filter(Boolean) as string[]

    if (imageUrls.length) {
      await FileService.deleteImageByUrls(this.bucket, imageUrls)
    }

    return platform
  }

  static deleteMany = async (
    db: DBClient,
    userId: string,
    request: BulkDeletePlatformsRequest,
  ): Promise<BulkDeletePlatformsResponse> => {
    const { ids } = request

    await this.checkPlatformsExist(db, userId, ids)

    const platforms = await Repository.destroyMany(db, userId, request)

    const imageUrls = platforms
      .flatMap((platform) => [platform.thumbnail])
      .filter(Boolean) as string[]

    if (imageUrls.length) {
      await FileService.deleteImageByUrls(this.bucket, imageUrls)
    }

    return platforms
  }
}
