import type { DBClient } from '@/server/db'
import type { QueryParams } from '@/server/models'
import { CommonRepository } from '../common'
import type {
  BaseCreatePlatformRequest,
  BaseUpdatePlatformRequest,
  BulkCreatePlatformsResponse,
  BulkDeletePlatformsRequest,
  BulkDeletePlatformsResponse,
  CreatePlatformResponse,
  DeletePlatformRequest,
  DeletePlatformResponse,
  PlatformResponse,
  PublicPlatformResponse,
  UpdatePlatformResponse,
} from './platform.model'

export class PlatformRepository extends CommonRepository {
  protected static override orQuery = ['title', 'slug']

  static findMany = async (
    db: DBClient,
    userId: string,
    params: QueryParams,
  ): Promise<PlatformResponse[]> => {
    const { page, limit, search, sort } = params
    const skip = (page - 1) * limit
    const OR = search ? this.getOrQuery(search) : undefined
    const orderBy = this.getOrderBy(sort)
    const platforms = await db.platform.findMany({
      where: { userId, ...(OR && { OR }) },
      omit: { userId: true },
      take: limit,
      skip,
      orderBy,
    })

    return platforms
  }

  static findManyPublic = async (
    db: DBClient,
    username: string,
    params: QueryParams,
  ): Promise<PublicPlatformResponse[]> => {
    const { page, limit, search, sort } = params
    const skip = (page - 1) * limit
    const OR = search ? this.getOrQuery(search) : undefined
    const orderBy = this.getOrderBy(sort)
    const platforms = await db.platform.findMany({
      where: { user: { username }, visibility: 'PUBLIC', ...(OR && { OR }) },
      select: {
        title: true,
        slug: true,
        url: true,
        description: true,
        password: true,
        thumbnail: true,
        user: { select: { username: true } },
      },
      take: limit,
      skip,
      orderBy,
    })

    return platforms
  }

  static findUniqueId = async (
    db: DBClient,
    userId: string,
    id: string,
  ): Promise<PlatformResponse | null> => {
    const platform = await db.platform.findUnique({
      where: { userId, id },
      omit: { userId: true },
    })

    return platform
  }

  static findPublicUniqueSlug = async (
    db: DBClient,
    username: string,
    slug: string,
  ): Promise<PublicPlatformResponse | null> => {
    const platform = await db.platform.findUnique({
      where: { user: { username }, slug, visibility: 'PUBLIC' },
      select: {
        title: true,
        slug: true,
        url: true,
        description: true,
        password: true,
        thumbnail: true,
        user: { select: { username: true } },
      },
    })

    return platform
  }

  static findPublicUniqueSlugSuffix = async (
    db: DBClient,
    suffix: string,
  ): Promise<PublicPlatformResponse | null> => {
    const platform = await db.platform.findFirst({
      where: { slug: { endsWith: `-${suffix}` }, visibility: 'PUBLIC' },
      select: {
        title: true,
        slug: true,
        url: true,
        description: true,
        password: true,
        thumbnail: true,
        user: { select: { username: true } },
      },
    })

    return platform
  }

  static countAll = async (
    db: DBClient,
    userId: string,
    search: string,
  ): Promise<number> => {
    const OR = search ? this.getOrQuery(search) : undefined

    const count = await db.platform.count({
      where: { userId, ...(OR && { OR }) },
    })

    return count
  }

  static countPublicAll = async (
    db: DBClient,
    username: string,
    search: string,
  ): Promise<number> => {
    const OR = search ? this.getOrQuery(search) : undefined

    const count = await db.platform.count({
      where: {
        user: { username },
        visibility: 'PUBLIC',
        ...(OR && { OR }),
      },
    })

    return count
  }

  static countByIds = async (db: DBClient, ids: string[]): Promise<number> => {
    const count = db.platform.count({ where: { id: { in: ids } } })

    return count
  }

  static countById = async (db: DBClient, id: string): Promise<number> => {
    const count = await db.platform.count({ where: { id } })

    return count
  }

  static countByUserAndTitle = async (
    db: DBClient,
    userId: string,
    title: string,
  ): Promise<number> => {
    const count = await db.platform.count({
      where: { userId, title: { equals: title, mode: 'insensitive' } },
    })

    return count
  }

  static countBySlug = async (db: DBClient, slug: string): Promise<number> => {
    const hashSegment = slug.split('-').pop()

    const count = await db.platform.count({
      where: hashSegment
        ? { slug: { endsWith: hashSegment, mode: 'insensitive' } }
        : { slug: { equals: slug, mode: 'insensitive' } },
    })

    return count
  }

  static insert = async (
    db: DBClient,
    request: BaseCreatePlatformRequest,
  ): Promise<CreatePlatformResponse> => {
    const platform = await db.platform.create({
      data: request,
      omit: { userId: true, updatedAt: true },
    })

    return platform
  }

  static insertMany = async (
    db: DBClient,
    requests: BaseCreatePlatformRequest[],
  ): Promise<BulkCreatePlatformsResponse> => {
    const data = await db.platform.createManyAndReturn({
      data: requests,
      omit: { userId: true, updatedAt: true },
    })

    return { data, count: data.length }
  }

  static update = async (
    db: DBClient,
    id: string,
    userId: string,
    request: BaseUpdatePlatformRequest,
  ): Promise<UpdatePlatformResponse> => {
    const platform = await db.platform.update({
      where: { userId, id },
      data: request,
      omit: { userId: true, createdAt: true },
    })

    return platform
  }

  static destroy = async (
    db: DBClient,
    userId: string,
    request: DeletePlatformRequest,
  ): Promise<DeletePlatformResponse> => {
    const { id } = request

    const platform = await db.platform.delete({
      where: { userId, id },
      select: { id: true, thumbnail: true, qrCodeUrl: true },
    })

    return platform
  }

  static destroyMany = async (
    db: DBClient,
    userId: string,
    request: BulkDeletePlatformsRequest,
  ): Promise<BulkDeletePlatformsResponse> => {
    const { ids } = request

    const platforms = await db.platform.findMany({
      where: { userId, id: { in: ids } },
      select: { id: true, thumbnail: true, qrCodeUrl: true },
    })

    await db.platform.deleteMany({ where: { id: { in: ids } } })

    return platforms
  }
}
