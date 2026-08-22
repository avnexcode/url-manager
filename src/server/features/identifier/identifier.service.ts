import type { QueryResponse } from '@/interfaces'
import { SUPABASE_BUCKET } from '@/lib/supabase/bucket'
import type { DBClient } from '@/server/db'
import type { QueryParams } from '@/server/models'
import { FileService } from '@/server/services'
import { generateSlug } from '@/utils'
import { CommonService } from '../common'
import type {
  BulkDeleteIdentifiersRequest,
  BulkDeleteIdentifiersResponse,
  CreateIdentifierRequest,
  CreateIdentifierResponse,
  DeleteIdentifierRequest,
  DeleteIdentifierResponse,
  IdentifierResponse,
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
    userId: string,
    id: string,
  ): Promise<void> => {
    const count = await Repository.countById(db, userId, id)

    this.checkExists(count === 0)
  }

  private static checkIdentifiersExist = async (
    db: DBClient,
    userId: string,
    ids: string[],
  ): Promise<void> => {
    const count = await Repository.countByIds(db, userId, ids)

    this.checkExists(count !== ids.length)
  }

  private static checkConflict = async (
    db: DBClient,
    key: 'title' | 'slug',
    userId: string,
    value: string,
  ): Promise<void> => {
    if (key === 'title') {
      const count = await Repository.countByUserAndTitle(db, userId, value)

      this.checkExists(
        count !== 0,
        'CONFLICT',
        this.m.model_identifier_field_title(),
      )
    }
  }

  static getAll = async (
    db: DBClient,
    userId: string,
    params: QueryParams,
  ): Promise<QueryResponse<IdentifierResponse>> => {
    const { page, limit, search } = params

    const total = await Repository.countAll(db, userId, search)

    const data = await Repository.findMany(db, userId, params)

    const lastPage = Math.ceil(total / limit)

    return { data, meta: { total, limit, page, lastPage } }
  }

  static getById = async (
    db: DBClient,
    userId: string,
    id: string,
  ): Promise<IdentifierResponse> => {
    const identifier = await Repository.findById(db, userId, id)

    return this.checkNotNull(identifier)
  }

  static create = async (
    db: DBClient,
    userId: string,
    request: CreateIdentifierRequest,
  ): Promise<CreateIdentifierResponse> => {
    const { title } = request

    const slug = generateSlug({ text: title })

    await this.checkConflict(db, 'title', userId, title)

    const identifier = await Repository.insert(db, { userId, slug, ...request })

    return identifier
  }

  static update = async (
    db: DBClient,
    id: string,
    userId: string,
    request: UpdateIdentifierRequest,
  ): Promise<UpdateIdentifierResponse> => {
    const { title } = request

    await this.checkIdentifierExists(db, userId, id)

    const { title: oldTitle } = await this.getById(db, userId, id)

    const countTitle = await Repository.countByUserAndTitle(db, userId, title)

    const conflict = countTitle !== 0 && title !== oldTitle

    this.checkExists(
      conflict,
      'CONFLICT',
      this.m.model_identifier_field_title(),
    )

    const identifier = await Repository.update(db, id, userId, request)

    return identifier
  }

  static delete = async (
    db: DBClient,
    userId: string,
    request: DeleteIdentifierRequest,
  ): Promise<DeleteIdentifierResponse> => {
    const { id } = request

    await this.checkIdentifierExists(db, userId, id)

    const identifier = await Repository.destroy(db, userId, request)

    const imageUrls = [identifier.thumbnail].filter(Boolean) as string[]

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

    await this.checkIdentifiersExist(db, userId, ids)

    const identifiers = await Repository.destroyMany(db, userId, request)

    const imageUrls = identifiers
      .flatMap((identifier) => [identifier.thumbnail])
      .filter(Boolean) as string[]

    if (imageUrls.length) {
      await this.file.deleteFileByUrls(this.bucket, imageUrls)
    }

    return identifiers
  }
}
