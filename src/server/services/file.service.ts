import type { SUPABASE_BUCKET } from '@/lib/supabase/bucket'
import { SupabaseService } from './supabase.service'

export type ImageUrlsByBucket = Partial<Record<SUPABASE_BUCKET, string[]>>

export class FileService {
  static getImageUrl = async (bucket: SUPABASE_BUCKET, path: string) => {
    const timestamp = new Date().getTime().toString()

    const publicUrl = await SupabaseService.storage.getPublicUrl(bucket, path)

    const imageUrl = publicUrl + '?t=' + timestamp

    return imageUrl
  }

  static uploadFile = async (
    bucket: SUPABASE_BUCKET,
    fileName: string,
    buffer: Buffer<ArrayBufferLike>,
  ): Promise<string> => {
    const config = { contentType: 'image/png', upsert: true }

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

  static deleteImagesByBucket = async (
    imageUrls: ImageUrlsByBucket,
  ): Promise<void> => {
    const entries = Object.entries(imageUrls) as [SUPABASE_BUCKET, string[]][]

    for (const [bucket, urls] of entries) {
      if (!urls.length) continue
      try {
        await this.deleteFileByUrls(bucket, urls)
      } catch (error) {
        console.error(`failed to cleanup images in bucket ${bucket}`, error)
      }
    }
  }

  // static mergeImageUrlsByBucket = (
  //   ...groups: ImageUrlsByBucket[]
  // ): ImageUrlsByBucket => {
  //   const bucketNames = new Set(
  //     groups.flatMap((group) => Object.keys(group)),
  //   ) as Set<SUPABASE_BUCKET>

  //   return Object.fromEntries(
  //     [...bucketNames].map((bucket) => {
  //       const urlsForThisBucket = groups.flatMap((group) => group[bucket] ?? [])
  //       return [bucket, urlsForThisBucket]
  //     }),
  //   )
  // }

  static mergeImageUrlsByBucket = (
    ...groups: ImageUrlsByBucket[]
  ): ImageUrlsByBucket => {
    const bucketNames = new Set(
      groups.flatMap((group) => Object.keys(group)),
    ) as Set<SUPABASE_BUCKET>

    const merged: ImageUrlsByBucket = {}

    for (const bucket of bucketNames) {
      merged[bucket] = groups.flatMap((group) => group[bucket] ?? [])
    }

    return merged
  }
}
