import { env } from '@/configs/env'
import type { SUPABASE_BUCKET } from '@/lib/supabase/bucket'
import { extractSlugId } from '@/utils'
import QRCode from 'qrcode'
import { FileService } from './file.service'

type GenerateResult = {
  qrEncodedValue: string
  qrCodeUrl: string
}

type BuildQrEncodedValueType = 'IDENTIFIER' | 'PLATFORM' | 'URL'

export class QrCodeService {
  private static readonly OPTIONS: QRCode.QRCodeToBufferOptions = {
    type: 'png',
    errorCorrectionLevel: 'M',
    margin: 2,
    width: 512,
  }

  private static buildQrEncodedValue = (
    type: BuildQrEncodedValueType,
    slug: string,
  ): string => {
    const prefix = extractSlugId({ slug })

    const baseUrl = env.VITE_BASE_URL

    let value = ''

    if (type === 'IDENTIFIER') value = `${baseUrl}/i/${prefix}`

    if (type === 'PLATFORM') value = `${baseUrl}/p/${prefix}`

    if (type === 'URL') value = `${baseUrl}/s/${prefix}`

    return value
  }

  private static buildFileName = (username: string, slug: string): string => {
    return `${username}-qr-${slug}.png`
  }

  static generate = async (
    bucket: SUPABASE_BUCKET,
    type: BuildQrEncodedValueType,
    params: { username: string; slug: string },
  ): Promise<GenerateResult> => {
    const { username, slug } = params

    const fileName = this.buildFileName(username, slug)

    const qrEncodedValue = this.buildQrEncodedValue(type, slug)

    const buffer = await QRCode.toBuffer(qrEncodedValue, this.OPTIONS)

    const qrCodeUrl = await FileService.uploadFile(bucket, fileName, buffer)

    return { qrEncodedValue, qrCodeUrl }
  }
}
