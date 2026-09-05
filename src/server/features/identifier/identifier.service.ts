import type { QueryResponse } from '@/interfaces'
import { SUPABASE_BUCKET } from '@/lib/supabase/bucket'
import type { DBClient } from '@/server/db'
import type { QueryParams } from '@/server/models'
import type { ImageUrlsByBucket } from '@/server/services'
import { FileService, QrCodeService } from '@/server/services'
import { generateSlug } from '@/utils'
import { CommonService } from '../common'
import { SettingService } from '../settings'
import { UrlService } from '../url'
import { UserService } from '../user'
import type {
  BaseCreateIdentifierRequest,
  BulkCreateIdentifiersRequest,
  BulkCreateIdentifiersResponse,
  BulkDeleteIdentifiersRequest,
  BulkDeleteIdentifiersResponse,
  CreateIdentifierRequest,
  CreateIdentifierResponse,
  DeleteIdentifierRequest,
  DeleteIdentifierResponse,
  IdentifierResponse,
  PublicIdentifierResponse,
  UpdateIdentifierRequest,
  UpdateIdentifierResponse,
} from './identifier.model'
import { IdentifierRepository as Repository } from './identifier.repository'

export class IdentifierService extends CommonService {
  protected static override get baseModel() {
    return this.m.model_identifier_title()
  }

  private static checkIdentifierExists = async (
    db: DBClient,
    id: string,
  ): Promise<void> => {
    const count = await Repository.countUniqueId(db, id)

    this.checkExists(count === 0)
  }

  private static checkIdentifiersExist = async (
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

      this.checkExists(
        count !== 0,
        'CONFLICT',
        this.m.model_identifier_field_title(),
      )
    }
  }

  private static checkPublicAccess = async (db: DBClient, username: string) => {
    const { publicAccess, publicIdentifierAccess } =
      await SettingService.getByUsername(db, username)

    if (publicAccess === false || publicIdentifierAccess === false) {
      this.throwError('FORBIDDEN')
    }
  }

  static getAll = async (
    db: DBClient,
    userId: string,
    params: QueryParams,
  ): Promise<QueryResponse<IdentifierResponse>> => {
    const { page, limit, search } = params

    const [total, data] = await Promise.all([
      Repository.countAll(db, userId, search),
      Repository.findMany(db, userId, params),
    ])

    const lastPage = Math.ceil(total / limit)

    return { data, meta: { total, limit, page, lastPage } }
  }

  static getPublicAll = async (
    db: DBClient,
    username: string,
    params: QueryParams,
  ): Promise<QueryResponse<PublicIdentifierResponse>> => {
    const { page, limit, search } = params

    await this.checkPublicAccess(db, username)

    const [total, data] = await Promise.all([
      Repository.countPublicAll(db, username, search),
      Repository.findManyPublic(db, username, params),
    ])

    const lastPage = Math.ceil(total / limit)

    return { data, meta: { total, limit, page, lastPage } }
  }

  static getById = async (
    db: DBClient,
    userId: string,
    id: string,
  ): Promise<IdentifierResponse> => {
    const identifier = await Repository.findUniqueId(db, userId, id)

    return this.checkNotNull(identifier)
  }

  static getPublicBySlugSuffix = async (
    db: DBClient,
    suffix: string,
  ): Promise<PublicIdentifierResponse> => {
    const identifier = await Repository.findPublicUniqueSlugSuffix(db, suffix)

    return this.checkNotNull(identifier)
  }

  static getPublicBySlug = async (
    db: DBClient,
    username: string,
    slug: string,
  ): Promise<PublicIdentifierResponse> => {
    await this.checkPublicAccess(db, username)

    const identifier = await Repository.findPublicUniqueSlug(db, username, slug)

    return this.checkNotNull(identifier)
  }

  static getPublicAccessPassword = async (
    db: DBClient,
    username: string,
    slug: string,
    password: string,
  ): Promise<{ redirectUrl: string }> => {
    await this.checkPublicAccess(db, username)

    const identifier = await this.getPublicBySlug(db, username, slug)

    if (password !== identifier.password) {
      this.throwError('BAD_REQUEST')
    }

    const redirectUrl = `/${username}/identifier/${slug}?password=${password}`

    return { redirectUrl }
  }

  static getIdsByUser = async (
    db: DBClient,
    userId: string,
  ): Promise<string[]> => {
    const identifiers = await Repository.findIdsUniqueUser(db, userId)

    return identifiers.map((identifier) => identifier.id)
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
    request: CreateIdentifierRequest,
  ): Promise<CreateIdentifierResponse> => {
    const { title } = request

    await this.checkConflict(db, 'title', userId, title)

    const slug = await this.getSlug(db, title)

    const { username } = await UserService.getById(db, userId)

    const { qrEncodedValue, qrCodeUrl } = await QrCodeService.generate(
      SUPABASE_BUCKET.Identifier,
      'IDENTIFIER',
      { username, slug },
    )

    const requestData = { userId, slug, qrEncodedValue, qrCodeUrl, ...request }

    try {
      return await Repository.insert(db, requestData)
    } catch (error) {
      try {
        await FileService.deleteFileByUrls(SUPABASE_BUCKET.Identifier, [
          qrCodeUrl,
        ])
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
    requests: BulkCreateIdentifiersRequest,
  ): Promise<BulkCreateIdentifiersResponse> => {
    await Promise.all(
      requests.map(async ({ title }) => {
        await this.checkConflict(db, 'title', userId, title)
      }),
    )

    const titles = requests.map((r) => r.title.toLowerCase())
    const hasDuplicateInBatch = new Set(titles).size !== titles.length
    this.checkExists(
      hasDuplicateInBatch,
      'CONFLICT',
      this.m.model_identifier_field_title(),
    )

    const { username } = await UserService.getById(db, userId)

    const usedSlugs = new Set<string>()
    const requestData: BaseCreateIdentifierRequest[] = []
    const generatedQrUrls: string[] = []

    try {
      for (const item of requests) {
        const slug = await this.getSlug(db, item.title, usedSlugs)
        usedSlugs.add(slug)

        const { qrEncodedValue, qrCodeUrl } = await QrCodeService.generate(
          SUPABASE_BUCKET.Identifier,
          'IDENTIFIER',
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
            SUPABASE_BUCKET.Identifier,
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
    request: UpdateIdentifierRequest,
  ): Promise<UpdateIdentifierResponse> => {
    const { title } = request

    await this.checkIdentifierExists(db, id)

    const existingIdentifier = await this.getById(db, userId, id)

    let slug = existingIdentifier.slug

    if (title) {
      const countTitle = await Repository.countUniqueUserAndTitle(
        db,
        userId,
        title,
      )

      const isSimilarTitle =
        title.toLowerCase() === existingIdentifier.title.toLowerCase()

      const conflict = countTitle !== 0 && !isSimilarTitle

      this.checkExists(
        conflict,
        'CONFLICT',
        this.m.model_identifier_field_title(),
      )

      if (!isSimilarTitle) {
        slug = await this.getSlug(db, title)
      }
    }

    const { username } = await UserService.getById(db, userId)

    let qrEncodedValue = existingIdentifier.qrEncodedValue
    let qrCodeUrl = existingIdentifier.qrCodeUrl
    let newQrCodeUrl: string | null = null

    if (slug !== existingIdentifier.slug) {
      const qrCode = await QrCodeService.generate(
        SUPABASE_BUCKET.Identifier,
        'IDENTIFIER',
        {
          username,
          slug,
        },
      )

      qrEncodedValue = qrCode.qrEncodedValue
      qrCodeUrl = qrCode.qrCodeUrl
      newQrCodeUrl = qrCode.qrCodeUrl
    }

    const requestData = { slug, qrEncodedValue, qrCodeUrl, ...request }

    try {
      const identifier = await Repository.update(db, id, userId, requestData)

      if (newQrCodeUrl) {
        try {
          await FileService.deleteFileByUrls(SUPABASE_BUCKET.Identifier, [
            existingIdentifier.qrCodeUrl,
          ])
        } catch (cleanupError) {
          console.error(
            'failed to cleanup old qr code after update',
            cleanupError,
          )
        }
      }

      return identifier
    } catch (error) {
      if (newQrCodeUrl) {
        try {
          await FileService.deleteFileByUrls(SUPABASE_BUCKET.Identifier, [
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
    request: DeleteIdentifierRequest,
  ): Promise<DeleteIdentifierResponse> => {
    const { id } = request

    await this.checkIdentifierExists(db, id)

    const urlIds = await UrlService.getIdsByRelation(db, { identifierId: id })

    const identifier = await db.$transaction(async (tx) => {
      if (urlIds.length) {
        await UrlService.deleteMany(tx, userId, { ids: urlIds })
      }

      return await Repository.destroy(tx, userId, request)
    })

    const imageUrls = [identifier.thumbnail, identifier.qrCodeUrl].filter(
      Boolean,
    ) as string[]

    if (imageUrls.length) {
      try {
        await FileService.deleteFileByUrls(
          SUPABASE_BUCKET.Identifier,
          imageUrls,
        )
      } catch (error) {
        console.error('failed to cleanup identifier images', error)
      }
    }

    return identifier
  }

  static deleteManyCore = async (
    db: DBClient,
    userId: string,
    ids: string[],
  ): Promise<{
    identifiers: BulkDeleteIdentifiersResponse
    imageUrls: ImageUrlsByBucket
  }> => {
    await this.checkIdentifiersExist(db, ids)

    const urlIds = await UrlService.getIdsByRelation(db, { identifierId: ids })

    let urlImages: ImageUrlsByBucket = {}

    if (urlIds.length) {
      const result = await UrlService.deleteManyCore(db, userId, urlIds)

      urlImages = result.imageUrls
    }

    const identifiers = await Repository.destroyMany(db, userId, { ids })

    const imageUrls = identifiers
      .flatMap((identifier) => [identifier.thumbnail, identifier.qrCodeUrl])
      .filter(Boolean) as string[]

    const identifierImages: ImageUrlsByBucket = imageUrls.length
      ? { [SUPABASE_BUCKET.Identifier]: imageUrls }
      : {}

    return {
      identifiers,
      imageUrls: FileService.mergeImageUrlsByBucket(
        urlImages,
        identifierImages,
      ),
    }
  }

  static deleteMany = async (
    db: DBClient,
    userId: string,
    request: BulkDeleteIdentifiersRequest,
  ): Promise<BulkDeleteIdentifiersResponse> => {
    const { ids } = request

    const { identifiers, imageUrls } = await db.$transaction(async (tx) => {
      return await this.deleteManyCore(tx, userId, ids)
    })

    await FileService.deleteImagesByBucket(imageUrls)

    return identifiers
  }
}
