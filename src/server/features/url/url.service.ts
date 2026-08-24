import type { QueryResponse } from '@/interfaces'
import { SUPABASE_BUCKET } from '@/lib/supabase/bucket'
import type { DBClient } from '@/server/db'
import type { QueryParams } from '@/server/models'
import { FileService, QrCodeService } from '@/server/services'
import { generateSlug } from '@/utils'
import { CommonService } from '../common'
import { UserService } from '../user'
import type {
  BulkDeleteUrlsRequest,
  BulkDeleteUrlsResponse,
  CreateUrlRequest,
  CreateUrlResponse,
  DeleteUrlRequest,
  DeleteUrlResponse,
  RelationParams,
  UpdateUrlRequest,
  UpdateUrlResponse,
  UrlResponse,
} from './url.model'
import { UrlRepository as Repository } from './url.repository'

export class UrlService extends CommonService {
  private static bucket = SUPABASE_BUCKET.Url
  private static file = FileService

  protected static override get baseModel() {
    return this.m.model_url_title()
  }

  private static checkUrlExists = async (
    db: DBClient,
    id: string,
  ): Promise<void> => {
    const count = await Repository.countById(db, id)

    this.checkExists(count === 0)
  }

  private static checkUrlsExist = async (
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

      this.checkExists(count !== 0, 'CONFLICT', this.m.model_url_field_title())
    }
  }

  static getAll = async (
    db: DBClient,
    userId: string,
    params: QueryParams,
    relation?: RelationParams,
  ): Promise<QueryResponse<UrlResponse>> => {
    const { page, limit, search } = params

    const [total, data] = await Promise.all([
      Repository.countAll(db, userId, search, relation),
      Repository.findMany(db, userId, params, relation),
    ])

    const lastPage = Math.ceil(total / limit)

    return { data, meta: { total, limit, page, lastPage } }
  }

  static getById = async (
    db: DBClient,
    userId: string,
    id: string,
  ): Promise<UrlResponse> => {
    const url = await Repository.findById(db, userId, id)

    return this.checkNotNull(url)
  }

  static getIdsByRelation = async (
    db: DBClient,
    relation?: RelationParams,
  ): Promise<string[]> => {
    const url = await Repository.findIdsByRelation(db, relation)

    return url.map((doc) => doc.id)
  }

  static create = async (
    db: DBClient,
    userId: string,
    request: CreateUrlRequest,
  ): Promise<CreateUrlResponse> => {
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
      'URL',
      { username, slug },
    )

    const requestData = { userId, slug, qrEncodedValue, qrCodeUrl, ...request }

    return await Repository.insert(db, requestData)
  }

  static update = async (
    db: DBClient,
    id: string,
    userId: string,
    request: UpdateUrlRequest,
  ): Promise<UpdateUrlResponse> => {
    const { title, url } = request

    if (url) {
      this.checkBlockedUrl(url)
    }

    await this.checkUrlExists(db, id)

    const existingUrl = await this.getById(db, userId, id)

    let slug = existingUrl.slug

    if (title) {
      const countTitle = await Repository.countByUserAndTitle(db, userId, title)

      const isSimilarTitle =
        title.toLowerCase() === existingUrl.title.toLowerCase()

      const conflict = countTitle !== 0 && !isSimilarTitle

      this.checkExists(conflict, 'CONFLICT', this.m.model_url_field_title())

      if (!isSimilarTitle) {
        slug = generateSlug({ text: title })
      }
    }

    const { username } = await UserService.getById(db, userId)

    let qrEncodedValue = existingUrl.qrEncodedValue
    let qrCodeUrl = existingUrl.qrCodeUrl

    if (slug !== existingUrl.slug) {
      await FileService.deleteFileByUrls(this.bucket, [qrCodeUrl])

      const qrCode = await QrCodeService.generate(this.bucket, 'URL', {
        username,
        slug,
      })

      qrEncodedValue = qrCode.qrEncodedValue
      qrCodeUrl = qrCode.qrCodeUrl
    }

    const requestData = { slug, qrEncodedValue, qrCodeUrl, ...request }

    return await Repository.update(db, id, userId, requestData)
  }

  static delete = async (
    db: DBClient,
    userId: string,
    request: DeleteUrlRequest,
  ): Promise<DeleteUrlResponse> => {
    const { id } = request

    await this.checkUrlExists(db, id)

    const url = await Repository.destroy(db, userId, request)

    const imageUrls = [url.thumbnail, url.qrCodeUrl].filter(Boolean) as string[]

    if (imageUrls.length) {
      await this.file.deleteFileByUrls(this.bucket, imageUrls)
    }

    return url
  }

  static deleteMany = async (
    db: DBClient,
    userId: string,
    request: BulkDeleteUrlsRequest,
  ): Promise<BulkDeleteUrlsResponse> => {
    const { ids } = request

    await this.checkUrlsExist(db, ids)

    const urls = await Repository.destroyMany(db, userId, request)

    const imageUrls = urls
      .flatMap((url) => [url.thumbnail, url.qrCodeUrl])
      .filter(Boolean) as string[]

    if (imageUrls.length) {
      await this.file.deleteFileByUrls(this.bucket, imageUrls)
    }

    return urls
  }
}
