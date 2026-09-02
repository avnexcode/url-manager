import { env } from '@/configs/env'
import type { SUPABASE_BUCKET } from '@/lib/supabase/bucket'
import { supabaseAdminClient as supabase } from '@/lib/supabase/server'

type CreateUserRequest = {
  email: string
  password: string
  email_confirm?: boolean
}

class SupabaseAuthService {
  static emailVerification = async (email: string) => {
    const emailRedirectTo = `${env.VITE_BASE_URL}/login`

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo },
    })

    if (error) throw error
  }

  static createUser = async (
    request: CreateUserRequest,
  ): Promise<{ userId: string }> => {
    const { email, password, email_confirm = false } = request

    let userId = ''

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      app_metadata: { language: 'id' },
      email_confirm,
    })

    if (data.user) userId = data.user.id

    if (error) throw error

    return { userId }
  }

  static updateUsername = async (
    id: string,
    username: string,
  ): Promise<void> => {
    const { error } = await supabase.auth.admin.updateUserById(id, {
      user_metadata: { username },
    })

    if (error) throw error
  }

  static updatePassword = async (
    id: string,
    password: string,
  ): Promise<void> => {
    const { error } = await supabase.auth.admin.updateUserById(id, {
      password,
    })

    if (error) throw error
  }

  static deleteUser = async (userId: string): Promise<void> => {
    const { error } = await supabase.auth.admin.deleteUser(userId)

    if (error) throw error
  }
}

class SupabaseStorageService {
  static getPublicUrl = async (
    bucket: SUPABASE_BUCKET,
    path: string,
  ): Promise<string> => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)

    return data.publicUrl
  }

  static uploadFile = async (
    bucket: SUPABASE_BUCKET,
    options: { fileName: string; buffer: Buffer<ArrayBufferLike>; config: {} },
  ): Promise<{ id: string; path: string; fullPath: string }> => {
    const { fileName, buffer, config } = options

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, buffer, config)

    if (error) throw error

    return data
  }

  static deleteFile = async (
    bucket: SUPABASE_BUCKET,
    fileNames: string[],
  ): Promise<void> => {
    const { error } = await supabase.storage.from(bucket).remove(fileNames)

    if (error) throw error
  }
}

export class SupabaseService {
  static auth = SupabaseAuthService
  static storage = SupabaseStorageService
}
