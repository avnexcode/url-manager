import type { SUPABASE_BUCKET } from '@/lib/supabase/bucket'
import { SupabaseService } from './supabase.service'

export class FileService {
  static getImageUrl = async (bucket: SUPABASE_BUCKET, path: string) => {
    const timestamp = new Date().getTime().toString()

    const publicUrl = await SupabaseService.storage.getPublicUrl(bucket, path)

    const imageUrl = publicUrl + '?t=' + timestamp

    return imageUrl
  }

  static uploadImageString = async (
    bucket: SUPABASE_BUCKET,
    fileName: string,
    image: string,
  ): Promise<string> => {
    const buffer = Buffer.from(image, 'base64')

    const config = {
      contentType: 'image/png',
      upsert: true,
    }

    const { path } = await SupabaseService.storage.uploadFile(bucket, {
      fileName,
      buffer,
      config,
    })

    const imageUrl = await this.getImageUrl(bucket, path)

    return imageUrl
  }

  static uploadImageBuffer = async (
    bucket: SUPABASE_BUCKET,
    fileName: string,
    buffer: Buffer<ArrayBufferLike>,
  ): Promise<string> => {
    const config = {
      contentType: 'image/png',
      upsert: true,
    }

    const { path } = await SupabaseService.storage.uploadFile(bucket, {
      fileName,
      buffer,
      config,
    })

    const imageUrl = await this.getImageUrl(bucket, path)

    return imageUrl
  }

  static getFileName = (imageUrl: string) => {
    const pathUrl = imageUrl.split('?')[0]

    const url = new URL(pathUrl)

    const pathSegments = url.pathname.split('/')

    const fileName = pathSegments[pathSegments.length - 1]

    return fileName
  }

  static deleteFileByUrls = async (
    bucket: SUPABASE_BUCKET,
    fileUrls: string[],
  ): Promise<void> => {
    const fileNames = fileUrls.map((url) => this.getFileName(url))

    await SupabaseService.storage.deleteFile(bucket, fileNames)
  }
}
