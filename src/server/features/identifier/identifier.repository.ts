import type { DBClient } from '@/server/db'
import type { QueryParams } from '@/server/models'
import { CommonRepository } from '../common'
import type {
  BaseIdentifierRequest,
  BulkDeleteIdentifiersRequest,
  BulkDeleteIdentifiersResponse,
  CreateIdentifierResponse,
  DeleteIdentifierRequest,
  DeleteIdentifierResponse,
  IdentifierResponse,
  UpdateIdentifierRequest,
  UpdateIdentifierResponse,
} from './identifier.model'

export class IdentifierRepository extends CommonRepository {
  protected static override orQuery = ['title']

  static findMany = async (
    db: DBClient,
    userId: string,
    params: QueryParams,
  ): Promise<IdentifierResponse[]> => {
    const { page, limit, search, sort } = params
    const skip = (page - 1) * limit
    const OR = this.getOrQuery(search)
    const orderBy = this.getOrderBy(sort)
    const identifiers = await db.identifier.findMany({
      where: { userId, ...(search && { OR }) },
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

  static countByIds = async (
    db: DBClient,
    userId: string,
    ids: string[],
  ): Promise<number> => {
    const count = db.identifier.count({ where: { userId, id: { in: ids } } })

    return count
  }

  static countById = async (
    db: DBClient,
    userId: string,
    id: string,
  ): Promise<number> => {
    const count = await db.identifier.count({ where: { userId, id } })

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

  static insert = async (
    db: DBClient,
    request: BaseIdentifierRequest,
  ): Promise<CreateIdentifierResponse> => {
    const identifier = await db.identifier.create({
      data: request,
      omit: { userId: true, updatedAt: true },
    })

    return identifier
  }

  static update = async (
    db: DBClient,
    id: string,
    userId: string,
    request: UpdateIdentifierRequest,
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
      select: { id: true, thumbnail: true },
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
      select: { id: true, thumbnail: true },
    })

    await db.identifier.deleteMany({ where: { id: { in: ids } } })

    return identifiers
  }
}
