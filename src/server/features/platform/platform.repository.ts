import type { DBClient } from '@/server/db'
import type { QueryParams } from '@/server/models'
import { CommonRepository } from '../common'
import type {
  BasePlatformRequest,
  BulkDeletePlatformsResponse,
  BulkDeletePlatformsRequest,
  CreatePlatformResponse,
  DeletePlatformRequest,
  DeletePlatformResponse,
  PlatformResponse,
  UpdatePlatformRequest,
  UpdatePlatformResponse,
} from './platform.model'

export class PlatformRepository extends CommonRepository {
  protected static override orQuery = ['title']

  static findMany = async (
    db: DBClient,
    userId: string,
    params: QueryParams,
  ): Promise<PlatformResponse[]> => {
    const { page, limit, search, sort } = params
    const skip = (page - 1) * limit
    const OR = this.getOrQuery(search)
    const orderBy = this.getOrderBy(sort)
    const platforms = await db.platform.findMany({
      where: { userId, ...(search && { OR }) },
      omit: { userId: true },
      take: limit,
      skip,
      orderBy,
    })

    return platforms
  }

  static findById = async (
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

  static countAll = async (
    db: DBClient,
    userId: string,
    search?: string,
  ): Promise<number> => {
    const OR = this.getOrQuery(search)

    const count = await db.platform.count({
      where: { userId, ...(search && { OR }) },
    })

    return count
  }

  static countByIds = async (
    db: DBClient,
    userId: string,
    ids: string[],
  ): Promise<number> => {
    const count = db.platform.count({ where: { userId, id: { in: ids } } })

    return count
  }

  static countById = async (
    db: DBClient,
    userId: string,
    id: string,
  ): Promise<number> => {
    const count = await db.platform.count({ where: { userId, id } })

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

  static insert = async (
    db: DBClient,
    request: BasePlatformRequest,
  ): Promise<CreatePlatformResponse> => {
    const platform = await db.platform.create({
      data: request,
      omit: { userId: true, updatedAt: true },
    })

    return platform
  }

  static update = async (
    db: DBClient,
    id: string,
    userId: string,
    request: UpdatePlatformRequest,
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
      select: { id: true, thumbnail: true },
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
      select: { id: true, thumbnail: true },
    })

    await db.platform.deleteMany({ where: { id: { in: ids } } })

    return platforms
  }
}
