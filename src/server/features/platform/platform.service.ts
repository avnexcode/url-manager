import type { QueryResponse } from '@/interfaces'
import { SUPABASE_BUCKET } from '@/lib/supabase/bucket'
import type { DBClient } from '@/server/db'
import type { QueryParams } from '@/server/models'
import { FileService, QrCodeService } from '@/server/services'
import { generateSlug } from '@/utils'
import { CommonService } from '../common'
import { UserService } from '../user'
import type {
  BaseCreatePlatformRequest,
  BulkCreatePlatformsRequest,
  BulkCreatePlatformsResponse,
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
import { UrlService } from '../url'

export class PlatformService extends CommonService {
  private static bucket = SUPABASE_BUCKET.Platform
  private static file = FileService

  protected static override get baseModel() {
    return this.m.model_platform_title()
  }

  private static checkPlatformExists = async (
    db: DBClient,
    id: string,
  ): Promise<void> => {
    const count = await Repository.countById(db, id)

    this.checkExists(count === 0)
  }

  private static checkPlatformsExist = async (
    db: DBClient,
    ids: string[],
  ): Promise<void> => {
    const count = await Repository.countByIds(db, ids)

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

    const [total, data] = await Promise.all([
      Repository.countAll(db, userId, search),
      Repository.findMany(db, userId, params),
    ])

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
    const { title, url } = request

    this.checkBlockedUrl(url)

    await this.checkConflict(db, 'title', userId, title)

    let slug = generateSlug({ text: title })

    const existsSLugCount = await Repository.countBySlug(db, slug)

    if (existsSLugCount > 0) {
      slug = generateSlug({ text: title })
    }

    const { username } = await UserService.getById(db, userId)

    const { qrEncodedValue, qrCodeUrl } = await QrCodeService.generate(
      this.bucket,
      'PLATFORM',
      { username, slug },
    )

    const requestData = { userId, slug, qrEncodedValue, qrCodeUrl, ...request }

    const platform = await Repository.insert(db, requestData)

    return platform
  }

  static createMany = async (
    db: DBClient,
    userId: string,
    requests: BulkCreatePlatformsRequest,
  ): Promise<BulkCreatePlatformsResponse> => {
    await Promise.all(
      requests.map(async ({ title, url }) => {
        this.checkBlockedUrl(url)
        await this.checkConflict(db, 'title', userId, title)
      }),
    )

    const { username } = await UserService.getById(db, userId)

    const usedSlugs = new Set<string>()
    const requestData: BaseCreatePlatformRequest[] = []

    for (const item of requests) {
      let slug = generateSlug({ text: item.title })
      let existsSlugCount = await Repository.countBySlug(db, slug)

      while (existsSlugCount > 0 || usedSlugs.has(slug)) {
        slug = generateSlug({ text: item.title })
        existsSlugCount = await Repository.countBySlug(db, slug)
      }

      usedSlugs.add(slug)

      const { qrEncodedValue, qrCodeUrl } = await QrCodeService.generate(
        this.bucket,
        'PLATFORM',
        { username, slug },
      )

      requestData.push({ userId, slug, qrEncodedValue, qrCodeUrl, ...item })
    }

    const platforms = await Repository.insertMany(db, requestData)

    return platforms
  }

  static update = async (
    db: DBClient,
    id: string,
    userId: string,
    request: UpdatePlatformRequest,
  ): Promise<UpdatePlatformResponse> => {
    const { title, url } = request

    await this.checkPlatformExists(db, id)

    if (url) {
      this.checkBlockedUrl(url)
    }

    const existingPlatform = await this.getById(db, userId, id)

    let slug = existingPlatform.slug

    if (title) {
      const countTitle = await Repository.countByUserAndTitle(db, userId, title)

      const isSimilarTitle =
        title.toLowerCase() === existingPlatform.title.toLowerCase()

      const conflict = countTitle !== 0 && !isSimilarTitle

      this.checkExists(
        conflict,
        'CONFLICT',
        this.m.model_platform_field_title(),
      )

      if (!isSimilarTitle) {
        slug = generateSlug({ text: title })
      }
    }

    const { username } = await UserService.getById(db, userId)

    let qrEncodedValue = existingPlatform.qrEncodedValue
    let qrCodeUrl = existingPlatform.qrCodeUrl

    if (slug !== existingPlatform.slug) {
      await FileService.deleteFileByUrls(this.bucket, [qrCodeUrl])

      const qrCode = await QrCodeService.generate(this.bucket, 'PLATFORM', {
        username,
        slug,
      })

      qrEncodedValue = qrCode.qrEncodedValue
      qrCodeUrl = qrCode.qrCodeUrl
    }

    const requestData = { slug, qrEncodedValue, qrCodeUrl, ...request }

    const platform = await Repository.update(db, id, userId, requestData)

    return platform
  }

  static delete = async (
    db: DBClient,
    userId: string,
    request: DeletePlatformRequest,
  ): Promise<DeletePlatformResponse> => {
    const { id } = request

    await this.checkPlatformExists(db, id)

    const urlIds = await UrlService.getIdsByRelation(db, { platformId: id })

    if (urlIds.length) {
      await UrlService.deleteMany(db, userId, { ids: urlIds })
    }

    const platform = await Repository.destroy(db, userId, request)

    const imageUrls = [platform.thumbnail, platform.qrCodeUrl].filter(
      Boolean,
    ) as string[]

    if (imageUrls.length) {
      await this.file.deleteFileByUrls(this.bucket, imageUrls)
    }

    return platform
  }

  static deleteMany = async (
    db: DBClient,
    userId: string,
    request: BulkDeletePlatformsRequest,
  ): Promise<BulkDeletePlatformsResponse> => {
    const { ids } = request

    await this.checkPlatformsExist(db, ids)

    const urlIds = await UrlService.getIdsByRelation(db, { platformId: ids })

    if (urlIds.length) {
      await UrlService.deleteMany(db, userId, { ids: urlIds })
    }

    const platforms = await Repository.destroyMany(db, userId, request)

    const imageUrls = platforms
      .flatMap((platform) => [platform.thumbnail, platform.qrCodeUrl])
      .filter(Boolean) as string[]

    if (imageUrls.length) {
      await this.file.deleteFileByUrls(this.bucket, imageUrls)
    }

    return platforms
  }
}
