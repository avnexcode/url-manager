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
  PublicPlatformResponse,
  UpdatePlatformRequest,
  UpdatePlatformResponse,
} from './platform.model'
import { PlatformRepository as Repository } from './platform.repository'

export class PlatformService extends CommonService {
  protected static override get baseModel() {
    return this.m.model_platform_title()
  }

  private static checkPlatformExists = async (
    db: DBClient,
    id: string,
  ): Promise<void> => {
    const count = await Repository.countUniqueId(db, id)

    this.checkExists(count === 0)
  }

  private static checkPlatformsExist = async (
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
        this.m.model_platform_field_title(),
      )
    }
  }

  private static checkPublicAccess = async (db: DBClient, username: string) => {
    const { publicAccess, publicPlatformAccess } =
      await SettingService.getByUsername(db, username)

    if (publicAccess === false || publicPlatformAccess === false) {
      this.throwError('FORBIDDEN')
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

  static getPublicAll = async (
    db: DBClient,
    username: string,
    params: QueryParams,
  ): Promise<QueryResponse<PublicPlatformResponse>> => {
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
  ): Promise<PlatformResponse> => {
    const platform = await Repository.findUniqueId(db, userId, id)

    return this.checkNotNull(platform)
  }

  static getPublicBySlugSuffix = async (
    db: DBClient,
    suffix: string,
  ): Promise<PublicPlatformResponse> => {
    const platform = await Repository.findPublicUniqueSlugSuffix(db, suffix)

    return this.checkNotNull(platform)
  }

  static getPublicBySlug = async (
    db: DBClient,
    username: string,
    slug: string,
  ): Promise<PublicPlatformResponse> => {
    await this.checkPublicAccess(db, username)

    const platform = await Repository.findPublicUniqueSlug(db, username, slug)

    return this.checkNotNull(platform)
  }

  static getPublicAccessPassword = async (
    db: DBClient,
    username: string,
    slug: string,
    password: string,
  ): Promise<{ redirectUrl: string }> => {
    await this.checkPublicAccess(db, username)

    const platform = await this.getPublicBySlug(db, username, slug)

    if (password !== platform.password) {
      this.throwError('BAD_REQUEST')
    }

    const redirectUrl = `/${username}/platform/${slug}?password=${password}`

    return { redirectUrl }
  }

  static getIdsByUser = async (
    db: DBClient,
    userId: string,
  ): Promise<string[]> => {
    const platforms = await Repository.findIdsUniqueUser(db, userId)

    return platforms.map((platform) => platform.id)
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
    request: CreatePlatformRequest,
  ): Promise<CreatePlatformResponse> => {
    const { title, url } = request

    this.checkBlockedUrl(url, 'BAD_REQUEST', this.m.model_platform_field_url())

    await this.checkConflict(db, 'title', userId, title)

    const slug = await this.getSlug(db, title)

    const { username } = await UserService.getById(db, userId)

    // Anchor step — WAJIB sukses, TIDAK di-try/catch.
    // Belum ada apa pun yang perlu di-compensate kalau ini gagal.
    const { qrEncodedValue, qrCodeUrl } = await QrCodeService.generate(
      SUPABASE_BUCKET.Platform,
      'PLATFORM',
      { username, slug },
    )

    const requestData = { userId, slug, qrEncodedValue, qrCodeUrl, ...request }

    try {
      return await Repository.insert(db, requestData)
    } catch (error) {
      // Repository.insert gagal SETELAH file QR sudah ke-upload → orphan, compensate
      try {
        await FileService.deleteFileByUrls(SUPABASE_BUCKET.Platform, [
          qrCodeUrl,
        ])
      } catch (cleanupError) {
        console.error(
          'failed to cleanup orphan qr code after create failure',
          cleanupError,
        )
      }
      throw error // tetap throw error ASLI dari Repository.insert
    }
  }

  static createMany = async (
    db: DBClient,
    userId: string,
    requests: BulkCreatePlatformsRequest,
  ): Promise<BulkCreatePlatformsResponse> => {
    await Promise.all(
      requests.map(async ({ title, url }) => {
        this.checkBlockedUrl(
          url,
          'BAD_REQUEST',
          this.m.model_platform_field_url(),
        )
        await this.checkConflict(db, 'title', userId, title)
      }),
    )

    // Cek duplikat title DI DALAM batch itu sendiri — checkConflict di atas
    // cuma cek ke DB, tidak mendeteksi dua item dalam satu request yang title-nya sama
    const titles = requests.map((r) => r.title.toLowerCase())
    const hasDuplicateInBatch = new Set(titles).size !== titles.length
    this.checkExists(
      hasDuplicateInBatch,
      'CONFLICT',
      this.m.model_platform_field_title(),
    )

    const { username } = await UserService.getById(db, userId)

    const usedSlugs = new Set<string>()
    const requestData: BaseCreatePlatformRequest[] = []
    const generatedQrUrls: string[] = []

    try {
      for (const item of requests) {
        const slug = await this.getSlug(db, item.title, usedSlugs)
        usedSlugs.add(slug)

        const { qrEncodedValue, qrCodeUrl } = await QrCodeService.generate(
          SUPABASE_BUCKET.Platform,
          'PLATFORM',
          { username, slug },
        )
        generatedQrUrls.push(qrCodeUrl)

        requestData.push({ userId, slug, qrEncodedValue, qrCodeUrl, ...item })
      }

      return await Repository.insertMany(db, requestData)
    } catch (error) {
      // insertMany gagal SETELAH sebagian/semua QR sudah ke-upload → semuanya orphan, compensate
      if (generatedQrUrls.length) {
        try {
          await FileService.deleteFileByUrls(
            SUPABASE_BUCKET.Platform,
            generatedQrUrls,
          )
        } catch (cleanupError) {
          console.error(
            'failed to cleanup orphan qr codes after createMany failure',
            cleanupError,
          )
        }
      }
      throw error // tetap throw error ASLI dari Repository.insertMany
    }
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
      this.checkBlockedUrl(
        url,
        'BAD_REQUEST',
        this.m.model_platform_field_url(),
      )
    }

    const existingPlatform = await this.getById(db, userId, id)

    let slug = existingPlatform.slug

    if (title) {
      const countTitle = await Repository.countUniqueUserAndTitle(
        db,
        userId,
        title,
      )

      const isSimilarTitle =
        title.toLowerCase() === existingPlatform.title.toLowerCase()

      const conflict = countTitle !== 0 && !isSimilarTitle

      this.checkExists(
        conflict,
        'CONFLICT',
        this.m.model_platform_field_title(),
      )

      if (!isSimilarTitle) {
        slug = await this.getSlug(db, title)
      }
    }

    const { username } = await UserService.getById(db, userId)

    let qrEncodedValue = existingPlatform.qrEncodedValue
    let qrCodeUrl = existingPlatform.qrCodeUrl
    let newQrCodeUrl: string | null = null

    if (slug !== existingPlatform.slug) {
      // Generate BARU dulu — anchor step, fatal, TIDAK di-try/catch.
      // Belum ada apa pun yang perlu di-compensate kalau ini gagal.
      const qrCode = await QrCodeService.generate(
        SUPABASE_BUCKET.Platform,
        'PLATFORM',
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
      const platform = await Repository.update(db, id, userId, requestData)

      // DB sudah commit sukses — baru hapus file LAMA, non-fatal
      if (newQrCodeUrl) {
        try {
          await FileService.deleteFileByUrls(SUPABASE_BUCKET.Platform, [
            existingPlatform.qrCodeUrl,
          ])
        } catch (cleanupError) {
          console.error(
            'failed to cleanup old qr code after update',
            cleanupError,
          )
        }
      }

      return platform
    } catch (error) {
      // Repository.update gagal → QR baru yang sudah ke-generate jadi orphan, compensate
      if (newQrCodeUrl) {
        try {
          await FileService.deleteFileByUrls(SUPABASE_BUCKET.Platform, [
            newQrCodeUrl,
          ])
        } catch (cleanupError) {
          console.error(
            'failed to cleanup new qr code after update failure',
            cleanupError,
          )
        }
      }
      throw error // tetap throw error ASLI dari Repository.update
    }
  }

  static delete = async (
    db: DBClient,
    userId: string,
    request: DeletePlatformRequest,
  ): Promise<DeletePlatformResponse> => {
    const { id } = request

    await this.checkPlatformExists(db, id)

    const urlIds = await UrlService.getIdsByRelation(db, { platformId: id })

    const platform = await db.$transaction(async (tx) => {
      if (urlIds.length) {
        await UrlService.deleteMany(tx, userId, { ids: urlIds })
      }

      return await Repository.destroy(tx, userId, request)
    })

    const imageUrls = [platform.thumbnail, platform.qrCodeUrl].filter(
      Boolean,
    ) as string[]

    if (imageUrls.length) {
      try {
        await FileService.deleteFileByUrls(SUPABASE_BUCKET.Platform, imageUrls)
      } catch (error) {
        console.error('failed to cleanup platform images', error)
      }
    }

    return platform
  }

  static deleteManyCore = async (
    db: DBClient,
    userId: string,
    ids: string[],
  ): Promise<{
    platforms: BulkDeletePlatformsResponse
    imageUrls: ImageUrlsByBucket
  }> => {
    await this.checkPlatformsExist(db, ids)

    const urlIds = await UrlService.getIdsByRelation(db, { platformId: ids })

    let urlImages: ImageUrlsByBucket = {}

    if (urlIds.length) {
      const result = await UrlService.deleteManyCore(db, userId, urlIds)

      urlImages = result.imageUrls
    }

    const platforms = await Repository.destroyMany(db, userId, { ids })

    const imageUrls = platforms
      .flatMap((platform) => [platform.thumbnail, platform.qrCodeUrl])
      .filter(Boolean) as string[]

    const platformImages: ImageUrlsByBucket = imageUrls.length
      ? { [SUPABASE_BUCKET.Platform]: imageUrls }
      : {}

    return {
      platforms,
      imageUrls: FileService.mergeImageUrlsByBucket(urlImages, platformImages),
    }
  }

  static deleteMany = async (
    db: DBClient,
    userId: string,
    request: BulkDeletePlatformsRequest,
  ): Promise<BulkDeletePlatformsResponse> => {
    const { ids } = request

    const { platforms, imageUrls } = await db.$transaction(async (tx) => {
      return await this.deleteManyCore(tx, userId, ids)
    })

    await FileService.deleteImagesByBucket(imageUrls)

    return platforms
  }
}
