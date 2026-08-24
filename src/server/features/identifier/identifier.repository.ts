import type { DBClient } from '@/server/db'
import type { QueryParams } from '@/server/models'
import { CommonRepository } from '../common'
import type {
  BaseCreateIdentifierRequest,
  BaseUpdateIdentifierRequest,
  BulkCreateIdentifiersResponse,
  BulkDeleteIdentifiersRequest,
  BulkDeleteIdentifiersResponse,
  CreateIdentifierResponse,
  DeleteIdentifierRequest,
  DeleteIdentifierResponse,
  IdentifierResponse,
  UpdateIdentifierResponse,
} from './identifier.model'

export class IdentifierRepository extends CommonRepository {
  protected static override orQuery = ['title', 'slug']

  static findMany = async (
    db: DBClient,
    userId: string,
    params: QueryParams,
  ): Promise<IdentifierResponse[]> => {
    const { page, limit, search, sort } = params
    const skip = (page - 1) * limit
    const OR = search ? this.getOrQuery(search) : undefined
    const orderBy = this.getOrderBy(sort)
    const identifiers = await db.identifier.findMany({
      where: { userId, ...(OR && { OR }) },
      omit: { userId: true },
      take: limit,
      skip,
      orderBy,
    })

    return identifiers
  }

  static findById = async (
    db: DBClient,
    userId: string,
    id: string,
  ): Promise<IdentifierResponse | null> => {
    const identifier = await db.identifier.findUnique({
      where: { userId, id },
      omit: { userId: true },
    })

    return identifier
  }

  static countAll = async (
    db: DBClient,
    userId: string,
    search?: string,
  ): Promise<number> => {
    const OR = this.getOrQuery(search)

    const count = await db.identifier.count({
      where: { userId, ...(search && { OR }) },
    })

    return count
  }

  static countByIds = async (db: DBClient, ids: string[]): Promise<number> => {
    const count = db.identifier.count({ where: { id: { in: ids } } })

    return count
  }

  static countById = async (db: DBClient, id: string): Promise<number> => {
    const count = await db.identifier.count({ where: { id } })

    return count
  }

  static countByUserAndTitle = async (
    db: DBClient,
    userId: string,
    title: string,
  ): Promise<number> => {
    const count = await db.identifier.count({
      where: { userId, title: { equals: title, mode: 'insensitive' } },
    })

    return count
  }

  static countBySlug = async (db: DBClient, slug: string): Promise<number> => {
    const hashSegment = slug.split('-').pop()

    const count = await db.identifier.count({
      where: hashSegment
        ? { slug: { endsWith: hashSegment, mode: 'insensitive' } }
        : { slug: { equals: slug, mode: 'insensitive' } },
    })

    return count
  }

  static insert = async (
    db: DBClient,
    request: BaseCreateIdentifierRequest,
  ): Promise<CreateIdentifierResponse> => {
    const identifier = await db.identifier.create({
      data: request,
      omit: { userId: true, updatedAt: true },
    })

    return identifier
  }

  static insertMany = async (
    db: DBClient,
    requests: BaseCreateIdentifierRequest[],
  ): Promise<BulkCreateIdentifiersResponse> => {
    const data = await db.identifier.createManyAndReturn({
      data: requests,
      omit: { userId: true, updatedAt: true },
    })

    return { data, count: data.length }
  }

  static update = async (
    db: DBClient,
    id: string,
    userId: string,
    request: BaseUpdateIdentifierRequest,
  ): Promise<UpdateIdentifierResponse> => {
    const identifier = await db.identifier.update({
      where: { userId, id },
      data: request,
      omit: { userId: true, createdAt: true },
    })

    return identifier
  }

  static destroy = async (
    db: DBClient,
    userId: string,
    request: DeleteIdentifierRequest,
  ): Promise<DeleteIdentifierResponse> => {
    const { id } = request

    const identifier = await db.identifier.delete({
      where: { userId, id },
      select: { id: true, thumbnail: true, qrCodeUrl: true },
    })

    return identifier
  }

  static destroyMany = async (
    db: DBClient,
    userId: string,
    request: BulkDeleteIdentifiersRequest,
  ): Promise<BulkDeleteIdentifiersResponse> => {
    const { ids } = request

    const identifiers = await db.identifier.findMany({
      where: { userId, id: { in: ids } },
      select: { id: true, thumbnail: true, qrCodeUrl: true },
    })

    await db.identifier.deleteMany({ where: { id: { in: ids } } })

    return identifiers
  }
}
