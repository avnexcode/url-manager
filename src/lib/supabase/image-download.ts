import { env } from '@/configs/env'

const DEFAULT_IMAGE_NAME = `${env.VITE_BASE_URL}-image`

export const processImageUrl = (url: string | undefined) => {
  if (!url) return null

  return url
}

export const extractFileName = (url: string) => {
  try {
    const baseUrl = url.split('?')[0]

    const fileName = baseUrl.split('/').pop() ?? DEFAULT_IMAGE_NAME

    return fileName
  } catch (error) {
    if (error) {
      return DEFAULT_IMAGE_NAME
    }
    return DEFAULT_IMAGE_NAME
  }
}

export const handleDownload = async (noteImageUrl?: string) => {
  if (!noteImageUrl) return

  const imageUrl = processImageUrl(noteImageUrl)
  if (!imageUrl) return

  try {
    const response = await fetch(imageUrl)
    const blob = await response.blob()

    const downloadLink = document.createElement('a')
    downloadLink.href = URL.createObjectURL(blob)

    const fileName = extractFileName(noteImageUrl)
    downloadLink.download = fileName

    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)

    URL.revokeObjectURL(downloadLink.href)
  } catch (error) {
    console.error('Error downloading image:', error)
  }
}
