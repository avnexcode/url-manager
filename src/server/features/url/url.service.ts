import type { QueryResponse } from '@/interfaces'
import { SUPABASE_BUCKET } from '@/lib/supabase/bucket'
import type { DBClient } from '@/server/db'
import type { QueryParams } from '@/server/models'
import type { ImageUrlsByBucket } from '@/server/services'
import { FileService, QrCodeService } from '@/server/services'
import { generateSlug } from '@/utils'
import { CommonService } from '../common'
import { UserService } from '../user'
import type {
  BaseCreateUrlRequest,
  BulkCreateUrlsRequest,
  BulkCreateUrlsResponse,
  BulkDeleteUrlsRequest,
  BulkDeleteUrlsResponse,
  CreateUrlRequest,
  CreateUrlResponse,
  DeleteUrlRequest,
  DeleteUrlResponse,
  PublicRelationParams,
  PublicUrlResponse,
  RelationParams,
  UpdateUrlRequest,
  UpdateUrlResponse,
  UrlResponse,
} from './url.model'
import { UrlRepository as Repository } from './url.repository'

export class UrlService extends CommonService {
  protected static override get baseModel() {
    return this.m.model_url_title()
  }

  private static checkUrlExists = async (
    db: DBClient,
    id: string,
  ): Promise<void> => {
    const count = await Repository.countUniqueId(db, id)

    this.checkExists(count === 0)
  }

  private static checkUrlsExist = async (
    db: DBClient,
    ids: string[],
  ): Promise<void> => {
    const count = await Repository.countUniqueIds(db, ids)

    this.checkExists(count !== ids.length)
  }

  private static checkConflict = async (
    db: DBClient,
    key: 'title' | 'slug',
    userId: string,
    value: string,
  ): Promise<void> => {
    if (key === 'title') {
      const count = await Repository.countUniqueUserAndTitle(db, userId, value)

      this.checkExists(count !== 0, 'CONFLICT', this.m.model_url_field_title())
    }
  }

  static getAll = async (
    db: DBClient,
    userId: string,
    relation: RelationParams,
    params: QueryParams,
  ): Promise<QueryResponse<UrlResponse>> => {
    const { page, limit, search } = params

    const [total, data] = await Promise.all([
      Repository.countAll(db, userId, relation, search),
      Repository.findMany(db, userId, relation, params),
    ])

    const lastPage = Math.ceil(total / limit)

    return { data, meta: { total, limit, page, lastPage } }
  }

  static getPublicAll = async (
    db: DBClient,
    username: string,
    relation: PublicRelationParams,
    params: QueryParams,
  ): Promise<QueryResponse<PublicUrlResponse>> => {
    const { page, limit, search } = params

    const [total, data] = await Promise.all([
      Repository.countPublicAll(db, username, relation, search),
      Repository.findManyPublic(db, username, relation, params),
    ])

    const lastPage = Math.ceil(total / limit)

    return { data, meta: { total, limit, page, lastPage } }
  }

  static getById = async (
    db: DBClient,
    userId: string,
    id: string,
  ): Promise<UrlResponse> => {
    const url = await Repository.findUniqueId(db, userId, id)

    return this.checkNotNull(url)
  }

  static getPublicBySlugSuffix = async (
    db: DBClient,
    suffix: string,
  ): Promise<PublicUrlResponse> => {
    const url = await Repository.findPublicUniqueSlugSuffix(db, suffix)

    return this.checkNotNull(url)
  }

  static getIdsByUser = async (
    db: DBClient,
    userId: string,
  ): Promise<string[]> => {
    const urls = await Repository.findIdsUniqueUser(db, userId)

    return urls.map((identifier) => identifier.id)
  }

  static getIdsByRelation = async (
    db: DBClient,
    relation: RelationParams,
  ): Promise<string[]> => {
    const hasExplicitEmptyArray = Object.values(relation ?? {}).some(
      (value) => Array.isArray(value) && value.length === 0,
    )

    if (hasExplicitEmptyArray) return []

    const url = await Repository.findIdsUniqueRelation(db, relation)

    return url.map((item) => item.id)
  }

  private static getSlug = async (
    db: DBClient,
    title: string,
    usedSlugs?: Set<string>,
  ): Promise<string> => {
    let slug = generateSlug({ text: title })

    let existsSlugCount = await Repository.countUniqueSlug(db, slug)

    while (existsSlugCount > 0 || usedSlugs?.has(slug)) {
      slug = generateSlug({ text: title })

      existsSlugCount = await Repository.countUniqueSlug(db, slug)
    }

    return slug
  }

  static create = async (
    db: DBClient,
    userId: string,
    request: CreateUrlRequest,
  ): Promise<CreateUrlResponse> => {
    const { title, url } = request

    this.checkBlockedUrl(url, 'BAD_REQUEST', this.m.model_url_field_url())

    await this.checkConflict(db, 'title', userId, title)

    const slug = await this.getSlug(db, title)

    const { username } = await UserService.getById(db, userId)

    const { qrEncodedValue, qrCodeUrl } = await QrCodeService.generate(
      SUPABASE_BUCKET.Url,
      'URL',
      { username, slug },
    )

    const requestData = { userId, slug, qrEncodedValue, qrCodeUrl, ...request }

    try {
      return await Repository.insert(db, requestData)
    } catch (error) {
      try {
        await FileService.deleteFileByUrls(SUPABASE_BUCKET.Url, [qrCodeUrl])
      } catch (cleanupError) {
        console.error(
          'failed to cleanup orphan qr code after create failure',
          cleanupError,
        )
      }
      throw error
    }
  }

  static createMany = async (
    db: DBClient,
    userId: string,
    requests: BulkCreateUrlsRequest,
  ): Promise<BulkCreateUrlsResponse> => {
    await Promise.all(
      requests.map(async ({ title, url }) => {
        this.checkBlockedUrl(url, 'BAD_REQUEST', this.m.model_url_field_url())
        await this.checkConflict(db, 'title', userId, title)
      }),
    )

    const titles = requests.map((r) => r.title.toLowerCase())

    const hasDuplicateInBatch = new Set(titles).size !== titles.length
    this.checkExists(
      hasDuplicateInBatch,
      'CONFLICT',
      this.m.model_url_field_title(),
    )

    const { username } = await UserService.getById(db, userId)

    const usedSlugs = new Set<string>()
    const requestData: BaseCreateUrlRequest[] = []
    const generatedQrUrls: string[] = []

    try {
      for (const item of requests) {
        const slug = await this.getSlug(db, item.title, usedSlugs)
        usedSlugs.add(slug)

        const { qrEncodedValue, qrCodeUrl } = await QrCodeService.generate(
          SUPABASE_BUCKET.Url,
          'URL',
          { username, slug },
        )
        generatedQrUrls.push(qrCodeUrl)

        requestData.push({ userId, slug, qrEncodedValue, qrCodeUrl, ...item })
      }

      return await Repository.insertMany(db, requestData)
    } catch (error) {
      if (generatedQrUrls.length) {
        try {
          await FileService.deleteFileByUrls(
            SUPABASE_BUCKET.Url,
            generatedQrUrls,
          )
        } catch (cleanupError) {
          console.error(
            'failed to cleanup orphan qr codes after createMany failure',
            cleanupError,
          )
        }
      }
      throw error
    }
  }

  static update = async (
    db: DBClient,
    id: string,
    userId: string,
    request: UpdateUrlRequest,
  ): Promise<UpdateUrlResponse> => {
    const { title, url } = request

    if (url) {
      this.checkBlockedUrl(url, 'BAD_REQUEST', this.m.model_url_field_url())
    }

    await this.checkUrlExists(db, id)

    const existingUrl = await this.getById(db, userId, id)

    let slug = existingUrl.slug

    if (title) {
      const countTitle = await Repository.countUniqueUserAndTitle(
        db,
        userId,
        title,
      )

      const isSimilarTitle =
        title.toLowerCase() === existingUrl.title.toLowerCase()

      const conflict = countTitle !== 0 && !isSimilarTitle

      this.checkExists(conflict, 'CONFLICT', this.m.model_url_field_title())

      if (!isSimilarTitle) {
        slug = await this.getSlug(db, title)
      }
    }

    const { username } = await UserService.getById(db, userId)

    let qrEncodedValue = existingUrl.qrEncodedValue
    let qrCodeUrl = existingUrl.qrCodeUrl
    let newQrCodeUrl: string | null = null

    if (slug !== existingUrl.slug) {
      const qrCode = await QrCodeService.generate(SUPABASE_BUCKET.Url, 'URL', {
        username,
        slug,
      })

      qrEncodedValue = qrCode.qrEncodedValue
      qrCodeUrl = qrCode.qrCodeUrl
      newQrCodeUrl = qrCode.qrCodeUrl
    }

    const requestData = { slug, qrEncodedValue, qrCodeUrl, ...request }

    try {
      const urlReturn = await Repository.update(db, id, userId, requestData)

      if (newQrCodeUrl) {
        try {
          await FileService.deleteFileByUrls(SUPABASE_BUCKET.Url, [
            existingUrl.qrCodeUrl,
          ])
        } catch (cleanupError) {
          console.error(
            'failed to cleanup old qr code after update',
            cleanupError,
          )
        }
      }

      return urlReturn
    } catch (error) {
      if (newQrCodeUrl) {
        try {
          await FileService.deleteFileByUrls(SUPABASE_BUCKET.Url, [
            newQrCodeUrl,
          ])
        } catch (cleanupError) {
          console.error(
            'failed to cleanup new qr code after update failure',
            cleanupError,
          )
        }
      }
      throw error
    }
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
      try {
        await FileService.deleteFileByUrls(SUPABASE_BUCKET.Url, imageUrls)
      } catch (error) {
        console.error('failed to cleanup url images', error)
      }
    }

    return url
  }

  static deleteManyCore = async (
    db: DBClient,
    userId: string,
    ids: string[],
  ): Promise<{
    urls: BulkDeleteUrlsResponse
    imageUrls: ImageUrlsByBucket
  }> => {
    await this.checkUrlsExist(db, ids)

    const urls = await Repository.destroyMany(db, userId, { ids })

    const imageUrls = urls
      .flatMap((url) => [url.thumbnail, url.qrCodeUrl])
      .filter(Boolean) as string[]

    return {
      urls,
      imageUrls: imageUrls.length ? { [SUPABASE_BUCKET.Url]: imageUrls } : {},
    }
  }

  static deleteMany = async (
    db: DBClient,
    userId: string,
    request: BulkDeleteUrlsRequest,
  ): Promise<BulkDeleteUrlsResponse> => {
    const { ids } = request

    const { urls, imageUrls } = await this.deleteManyCore(db, userId, ids)

    await FileService.deleteImagesByBucket(imageUrls)

    return urls
  }
}
