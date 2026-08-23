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
  UpdateUrlResponse,
  UrlResponse,
} from './url.model'

export class UrlRepository extends CommonRepository {
  protected static override orQuery = ['title']

  static findMany = async (
    db: DBClient,
    userId: string,
    params: QueryParams,
  ): Promise<UrlResponse[]> => {
    const { page, limit, search, sort } = params
    const skip = (page - 1) * limit
    const OR = this.getOrQuery(search)
    const orderBy = this.getOrderBy(sort)
    const urls = await db.url.findMany({
      where: { userId, ...(search && { OR }) },
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

  static countAll = async (
    db: DBClient,
    userId: string,
    search?: string,
  ): Promise<number> => {
    const OR = this.getOrQuery(search)

    const count = await db.url.count({
      where: { userId, ...(search && { OR }) },
    })

    return count
  }

  static countByIds = async (db: DBClient, ids: string[]): Promise<number> => {
    const count = db.url.count({ where: { id: { in: ids } } })

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
