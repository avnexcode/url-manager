import { env } from '@/configs/env'
import type { SUPABASE_BUCKET } from '@/lib/supabase/bucket'
import { extractSlugId } from '@/utils'
import QRCode from 'qrcode'
import sharp from 'sharp'
import { FileService } from './file.service'

type GenerateResult = {
  qrEncodedValue: string
  qrCodeUrl: string
}

type BuildQrEncodedValueType = 'IDENTIFIER' | 'PLATFORM' | 'URL'

export class QrCodeService {
  private static readonly SIZE = 512

  private static readonly LOGO_SIZE_RATIO = 0.22

  private static readonly OPTIONS: QRCode.QRCodeToBufferOptions = {
    type: 'png',
    errorCorrectionLevel: 'H', // wajib H karena logo menutupi bagian tengah
    margin: 2,
    width: 512,
  }

  // cache buffer logo di memory, supaya tidak fetch ulang setiap generate
  private static logoBufferPromise: Promise<Buffer> | null = null

  private static buildQrEncodedValue = (
    type: BuildQrEncodedValueType,
    slug: string,
  ): string => {
    const prefix = extractSlugId({ slug })

    const baseUrl = env.VITE_BASE_URL

    if (type === 'IDENTIFIER') return `${baseUrl}/i/${prefix}`

    if (type === 'PLATFORM') return `${baseUrl}/p/${prefix}`

    return `${baseUrl}/s/${prefix}`
  }

  private static buildFileName = (username: string, slug: string): string => {
    return `${username}-qr-${slug}.png`
  }

  private static fetchLogoBuffer = async (): Promise<Buffer> => {
    if (!this.logoBufferPromise) {
      this.logoBufferPromise = fetch(env.VITE_OG_IMAGE_URL)
        .then(async (res) => {
          if (!res.ok) {
            throw new Error(`Failed to fetch logo image: ${res.status}`)
          }

          const arrayBuffer = await res.arrayBuffer()

          return Buffer.from(arrayBuffer)
        })
        .catch((error) => {
          // reset cache supaya percobaan berikutnya fetch ulang, bukan stuck di promise gagal
          this.logoBufferPromise = null

          throw error
        })
    }

    return this.logoBufferPromise
  }

  private static composeLogo = async (qrBuffer: Buffer): Promise<Buffer> => {
    const logoSize = Math.round(this.SIZE * this.LOGO_SIZE_RATIO)

    const logoSourceBuffer = await this.fetchLogoBuffer()

    const resizedLogo = await sharp(logoSourceBuffer)
      .resize(logoSize, logoSize, { fit: 'contain' })
      .toBuffer()

    const padding = Math.round(logoSize * 0.12)
    const paddedSize = logoSize + padding * 2

    // background putih di belakang logo biar kontras terhadap dots QR
    const logoWithBackground = await sharp({
      create: {
        width: paddedSize,
        height: paddedSize,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    })
      .composite([{ input: resizedLogo, left: padding, top: padding }])
      .png()
      .toBuffer()

    const offset = Math.round((this.SIZE - paddedSize) / 2)

    return sharp(qrBuffer)
      .composite([{ input: logoWithBackground, left: offset, top: offset }])
      .png()
      .toBuffer()
  }

  static generate = async (
    bucket: SUPABASE_BUCKET,
    type: BuildQrEncodedValueType,
    params: { username: string; slug: string },
  ): Promise<GenerateResult> => {
    const { username, slug } = params

    const fileName = this.buildFileName(username, slug)

    const qrEncodedValue = this.buildQrEncodedValue(type, slug)

    const rawBuffer = await QRCode.toBuffer(qrEncodedValue, this.OPTIONS)

    let finalBuffer = rawBuffer

    try {
      finalBuffer = await this.composeLogo(rawBuffer)
    } catch {
      // non-fatal: kalau logo gagal diambil/di-composite, tetap lanjut pakai QR polos
      finalBuffer = rawBuffer
    }

    const qrCodeUrl = await FileService.uploadFile(
      bucket,
      fileName,
      finalBuffer,
    )

    return { qrEncodedValue, qrCodeUrl }
  }
}
