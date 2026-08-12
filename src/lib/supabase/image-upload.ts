import type { SUPABASE_BUCKET } from '@/lib/supabase/bucket'
import { supabase } from './client'

export const getImageUrl = async (
  supabaseBucket: SUPABASE_BUCKET,
  path: string,
) => {
  const timestamp = new Date().getTime().toString()

  const { data } = supabase.storage.from(supabaseBucket).getPublicUrl(path)

  const imageUrl = data.publicUrl + '?t=' + timestamp

  return imageUrl
}

export const uploadImage = async (
  supabaseBucket: SUPABASE_BUCKET,
  fileName: string,
  image: File,
) => {
  const config = {
    contentType: 'image/jpeg',
    upsert: true,
  }

  const { data, error } = await supabase.storage
    .from(supabaseBucket)
    .upload(fileName, image, config)

  if (error) throw error

  const imageUrl = await getImageUrl(supabaseBucket, data.path)

  return imageUrl
}

export const deleteImageByUrl = async (
  supabaseBucket: SUPABASE_BUCKET,
  imageUrl: string,
): Promise<void> => {
  const pathUrl = imageUrl.split('?')[0]

  const url = new URL(pathUrl)

  const pathSegments = url.pathname.split('/')

  const fileName = pathSegments[pathSegments.length - 1]

  const { error } = await supabase.storage
    .from(supabaseBucket)
    .remove([fileName])

  if (error) throw new Error(`Failed to delete image: ${error.message}`)
}
