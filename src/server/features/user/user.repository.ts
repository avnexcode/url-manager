import type { DBClient } from '@/server/db'
import { CommonRepository } from '../common'
import type {
  CreateUserRequest,
  CreateUserResponse,
  DeleteUserRequest,
  DeleteUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  UserResponse,
} from './user.model'

export class UserRepository extends CommonRepository {
  static findById = async (
    db: DBClient,
    id: string,
  ): Promise<UserResponse | null> => {
    const user = await db.user.findUnique({ where: { id } })

    return user
  }

  static countById = async (db: DBClient, id: string): Promise<number> => {
    const count = await db.user.count({ where: { id } })

    return count
  }

  static countByEmail = async (
    db: DBClient,
    email: string,
  ): Promise<number> => {
    const count = await db.user.count({ where: { email } })

    return count
  }

  static countByUsername = async (
    db: DBClient,
    username: string,
  ): Promise<number> => {
    const count = await db.user.count({ where: { username } })

    return count
  }

  static insert = async (
    db: DBClient,
    id: string,
    username: string,
    request: CreateUserRequest,
  ): Promise<CreateUserResponse> => {
    const user = await db.user.create({
      data: {
        id,
        username,
        email: request.email,
        providers: [request.provider],
        avatar: request.avatar,
      },
      omit: { updatedAt: true },
    })

    return user
  }

  static update = async (
    db: DBClient,
    id: string,
    request: UpdateUserRequest,
  ): Promise<UpdateUserResponse> => {
    const { provider, ...data } = request

    const user = await db.user.update({
      where: { id },
      data: {
        ...data,
        ...(provider ? { providers: { push: provider } } : {}),
      },
      omit: { createdAt: true },
    })

    return user
  }

  static destroy = async (
    db: DBClient,
    request: DeleteUserRequest,
  ): Promise<DeleteUserResponse> => {
    const { id } = request

    const user = await db.user.delete({
      where: { id },
      select: { id: true, image: true, avatar: true },
    })

    return user
  }
}
