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
    username: string,
    slug: string,
  ): string => {
    const prefix = extractSlugId({ slug })

    let qrEncodedValue = ''

    if (type === 'IDENTIFIER') {
      qrEncodedValue = `${env.VITE_BASE_URL}/${username}/i/${prefix}`
    }

    if (type === 'PLATFORM') {
      qrEncodedValue = `${env.VITE_BASE_URL}/${username}/p/${prefix}`
    }

    if (type === 'URL') {
      qrEncodedValue = `${env.VITE_BASE_URL}/${prefix}`
    }

    return qrEncodedValue
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
    const qrEncodedValue = this.buildQrEncodedValue(type, username, slug)

    const buffer = await QRCode.toBuffer(qrEncodedValue, this.OPTIONS)

    const qrCodeUrl = await FileService.uploadImageBuffer(
      bucket,
      fileName,
      buffer,
    )

    return { qrEncodedValue, qrCodeUrl }
  }
}
