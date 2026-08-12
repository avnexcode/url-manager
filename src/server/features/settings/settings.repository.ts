import type { DBClient } from "@/server/db";
import { CommonRepository } from "../common";
import type {
  BulkDeleteSettingRequest,
  BulkDeleteSettingResponse,
  CreateSettingRequest,
  CreateSettingResponse,
  DeleteSettingRequest,
  DeleteSettingResponse,
  SettingResponse,
  UpdateSettingRequest,
  UpdateSettingResponse,
} from "./settings.model";

export class SettingRepository extends CommonRepository {
  static findByUser = async (
    db: DBClient,
    userId: string,
  ): Promise<SettingResponse | null> => {
    const settings = await db.setting.findUnique({
      where: { userId },
      omit: { userId: true },
    });

    return settings;
  };

  static findIdByUser = async (
    db: DBClient,
    userId: string,
  ): Promise<{ id: string } | null> => {
    const settings = await db.setting.findUnique({
      where: { userId },
      select: { id: true },
    });

    return settings;
  };

  static findIdsByUsers = async (
    db: DBClient,
    userIds: string[],
  ): Promise<{ id: string }[]> => {
    const settings = await db.setting.findMany({
      where: { userId: { in: userIds } },
      select: { id: true },
    });

    return settings;
  };

  static countByIds = async (db: DBClient, ids: string[]): Promise<number> => {
    const count = await db.setting.count({ where: { id: { in: ids } } });

    return count;
  };

  static countById = async (db: DBClient, id: string): Promise<number> => {
    const count = await db.setting.count({ where: { id } });

    return count;
  };

  static countByUser = async (
    db: DBClient,
    userId: string,
  ): Promise<number> => {
    const count = await db.setting.count({ where: { userId } });

    return count;
  };

  static insert = async (
    db: DBClient,
    request: CreateSettingRequest,
  ): Promise<CreateSettingResponse> => {
    const settings = await db.setting.create({
      data: request,
      omit: { userId: true, updatedAt: true },
    });

    return settings;
  };

  static updateByUser = async (
    db: DBClient,
    userId: string,
    id: string,
    request: UpdateSettingRequest,
  ): Promise<UpdateSettingResponse> => {
    const settings = await db.setting.update({
      where: { userId, id },
      data: request,
      omit: { userId: true, createdAt: true },
    });

    return settings;
  };

  static destroy = async (
    db: DBClient,
    request: DeleteSettingRequest,
  ): Promise<DeleteSettingResponse> => {
    const { id } = request;

    const settings = await db.setting.delete({
      where: { id },
      select: { id: true },
    });

    return settings;
  };

  static destroyMany = async (
    db: DBClient,
    request: BulkDeleteSettingRequest,
  ): Promise<BulkDeleteSettingResponse> => {
    const { ids } = request;

    const settings = await db.setting.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });

    await db.setting.deleteMany({ where: { id: { in: ids } } });

    return settings;
  };
}
