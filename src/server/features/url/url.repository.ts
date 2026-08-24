import type { DBClient } from '@/server/db'
import type { QueryParams } from '@/server/models'
import { CommonRepository } from '../common'
import type {
  BaseCreateUrlRequest,
  BaseUpdateUrlRequest,
  BulkDeleteUrlsRequest,
  BulkDeleteUrlsResponse,
  CreateUrlResponse,
  DeleteUrlRequest,
  DeleteUrlResponse,
  RelationParams,
  UpdateUrlResponse,
  UrlResponse,
} from './url.model'

export class UrlRepository extends CommonRepository {
  protected static override orQuery = ['title', 'slug']

  private static toRelationFilter = (value?: string | string[]) => {
    if (!value) return undefined

    if (Array.isArray(value)) return value.length ? { in: value } : undefined

    return value
  }

  private static getRelationWhereClause = (relation?: RelationParams) => {
    const platformId = this.toRelationFilter(relation?.platformId)

    const identifierId = this.toRelationFilter(relation?.identifierId)

    return {
      ...(platformId && { platformId }),
      ...(identifierId && { identifierId }),
    }
  }

  private static getWhereClause = (
    userId: string,
    search: string | undefined,
    relation?: RelationParams,
  ) => {
    const OR = search ? this.getOrQuery(search) : undefined

    return {
      userId,
      ...this.getRelationWhereClause(relation),
      ...(OR && { OR }),
    }
  }

  static findMany = async (
    db: DBClient,
    userId: string,
    params: QueryParams,
    filter?: RelationParams,
  ): Promise<UrlResponse[]> => {
    const { page, limit, search, sort } = params
    const skip = (page - 1) * limit
    const where = this.getWhereClause(userId, search, filter)
    const orderBy = this.getOrderBy(sort)

    const urls = await db.url.findMany({
      where,
      omit: { userId: true },
      take: limit,
      skip,
      orderBy,
    })

    return urls
  }

  static findManyPublic = async (
    db: DBClient,
    params: QueryParams,
    filter?: RelationParams,
  ): Promise<UrlResponse[]> => {
    const { page, limit, search, sort } = params
    const skip = (page - 1) * limit
    const OR = search ? this.getOrQuery(search) : undefined
    const orderBy = this.getOrderBy(sort)

    const where = {
      ...this.getRelationWhereClause(filter),
      ...(OR && { OR }),
    }

    const urls = await db.url.findMany({
      where,
      omit: { userId: true },
      take: limit,
      skip,
      orderBy,
    })

    return urls
  }

  static findById = async (
    db: DBClient,
    userId: string,
    id: string,
  ): Promise<UrlResponse | null> => {
    const url = await db.url.findUnique({
      where: { userId, id },
      omit: { userId: true },
    })

    return url
  }

  static findIdsByRelation = async (
    db: DBClient,
    relation?: RelationParams,
  ): Promise<{ id: string }[]> => {
    const where = this.getRelationWhereClause(relation)

    const url = await db.url.findMany({ where, select: { id: true } })

    return url
  }

  static countAll = async (
    db: DBClient,
    userId: string,
    search: string | undefined,
    relation?: RelationParams,
  ): Promise<number> => {
    const where = this.getWhereClause(userId, search, relation)

    const count = await db.url.count({ where })

    return count
  }

  static countByIds = async (db: DBClient, ids: string[]): Promise<number> => {
    const count = await db.url.count({ where: { id: { in: ids } } })

    return count
  }

  static countById = async (db: DBClient, id: string): Promise<number> => {
    const count = await db.url.count({ where: { id } })

    return count
  }

  static countByUserAndTitle = async (
    db: DBClient,
    userId: string,
    title: string,
  ): Promise<number> => {
    const count = await db.url.count({
      where: { userId, title: { equals: title, mode: 'insensitive' } },
    })

    return count
  }

  static countBySlug = async (db: DBClient, slug: string): Promise<number> => {
    const hashSegment = slug.split('-').pop()

    const count = await db.url.count({
      where: hashSegment
        ? { slug: { endsWith: hashSegment, mode: 'insensitive' } }
        : { slug: { equals: slug, mode: 'insensitive' } },
    })

    return count
  }

  static insert = async (
    db: DBClient,
    request: BaseCreateUrlRequest,
  ): Promise<CreateUrlResponse> => {
    const url = await db.url.create({
      data: request,
      omit: { userId: true, updatedAt: true },
    })

    return url
  }

  static update = async (
    db: DBClient,
    id: string,
    userId: string,
    request: BaseUpdateUrlRequest,
  ): Promise<UpdateUrlResponse> => {
    const url = await db.url.update({
      where: { userId, id },
      data: request,
      omit: { userId: true, createdAt: true },
    })

    return url
  }

  static destroy = async (
    db: DBClient,
    userId: string,
    request: DeleteUrlRequest,
  ): Promise<DeleteUrlResponse> => {
    const { id } = request

    const url = await db.url.delete({
      where: { userId, id },
      select: { id: true, thumbnail: true, qrCodeUrl: true },
    })

    return url
  }

  static destroyMany = async (
    db: DBClient,
    userId: string,
    request: BulkDeleteUrlsRequest,
  ): Promise<BulkDeleteUrlsResponse> => {
    const { ids } = request

    const urls = await db.url.findMany({
      where: { userId, id: { in: ids } },
      select: { id: true, thumbnail: true, qrCodeUrl: true },
    })

    await db.url.deleteMany({ where: { id: { in: ids } } })

    return urls
  }
}
