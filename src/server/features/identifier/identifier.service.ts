import type { QueryResponse } from '@/interfaces'
import { SUPABASE_BUCKET } from '@/lib/supabase/bucket'
import type { DBClient } from '@/server/db'
import type { QueryParams } from '@/server/models'
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
  private static bucket = SUPABASE_BUCKET.Identifier
  private static file = FileService

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

  static create = async (
    db: DBClient,
    userId: string,
    request: CreateIdentifierRequest,
  ): Promise<CreateIdentifierResponse> => {
    const { title } = request

    await this.checkConflict(db, 'title', userId, title)

    let slug = generateSlug({ text: title })

    const existsSLugCount = await Repository.countUniqueSlug(db, slug)

    if (existsSLugCount > 0) {
      slug = generateSlug({ text: title })
    }

    const { username } = await UserService.getById(db, userId)

    const { qrEncodedValue, qrCodeUrl } = await QrCodeService.generate(
      this.bucket,
      'IDENTIFIER',
      { username, slug },
    )

    const requestData = { userId, slug, qrEncodedValue, qrCodeUrl, ...request }

    const identifier = await Repository.insert(db, requestData)

    return identifier
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

    const { username } = await UserService.getById(db, userId)

    const usedSlugs = new Set<string>()

    const requestData: BaseCreateIdentifierRequest[] = []

    for (const item of requests) {
      let slug = generateSlug({ text: item.title })
      let existsSlugCount = await Repository.countUniqueSlug(db, slug)

      while (existsSlugCount > 0 || usedSlugs.has(slug)) {
        slug = generateSlug({ text: item.title })
        existsSlugCount = await Repository.countUniqueSlug(db, slug)
      }

      usedSlugs.add(slug)

      const { qrEncodedValue, qrCodeUrl } = await QrCodeService.generate(
        this.bucket,
        'IDENTIFIER',
        { username, slug },
      )

      requestData.push({ userId, slug, qrEncodedValue, qrCodeUrl, ...item })
    }

    const identifiers = await Repository.insertMany(db, requestData)

    return identifiers
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
        slug = generateSlug({ text: title })
      }
    }

    const { username } = await UserService.getById(db, userId)

    let qrEncodedValue = existingIdentifier.qrEncodedValue
    let qrCodeUrl = existingIdentifier.qrCodeUrl

    if (slug !== existingIdentifier.slug) {
      await FileService.deleteFileByUrls(this.bucket, [qrCodeUrl])

      const qrCode = await QrCodeService.generate(this.bucket, 'IDENTIFIER', {
        username,
        slug,
      })

      qrEncodedValue = qrCode.qrEncodedValue
      qrCodeUrl = qrCode.qrCodeUrl
    }

    const requestData = { slug, qrEncodedValue, qrCodeUrl, ...request }

    const identifier = await Repository.update(db, id, userId, requestData)

    return identifier
  }

  static delete = async (
    db: DBClient,
    userId: string,
    request: DeleteIdentifierRequest,
  ): Promise<DeleteIdentifierResponse> => {
    const { id } = request

    await this.checkIdentifierExists(db, id)

    const urlIds = await UrlService.getIdsByRelation(db, { identifierId: id })

    if (urlIds.length) {
      await UrlService.deleteMany(db, userId, { ids: urlIds })
    }

    const identifier = await Repository.destroy(db, userId, request)

    const imageUrls = [identifier.thumbnail, identifier.qrCodeUrl].filter(
      Boolean,
    ) as string[]

    if (imageUrls.length) {
      await this.file.deleteFileByUrls(this.bucket, imageUrls)
    }

    return identifier
  }

  static deleteMany = async (
    db: DBClient,
    userId: string,
    request: BulkDeleteIdentifiersRequest,
  ): Promise<BulkDeleteIdentifiersResponse> => {
    const { ids } = request

    await this.checkIdentifiersExist(db, ids)

    const urlIds = await UrlService.getIdsByRelation(db, { identifierId: ids })

    if (urlIds.length) {
      await UrlService.deleteMany(db, userId, { ids: urlIds })
    }

    const identifiers = await Repository.destroyMany(db, userId, request)

    const imageUrls = identifiers
      .flatMap((identifier) => [identifier.thumbnail, identifier.qrCodeUrl])
      .filter(Boolean) as string[]

    if (imageUrls.length) {
      await this.file.deleteFileByUrls(this.bucket, imageUrls)
    }

    return identifiers
  }
}
