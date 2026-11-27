import { LIBRE_IMAGE_MAX_CHARS, validLibreRaster } from '@/fiches/libre-metadata'

const TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SOURCE_BYTES = 2_500_000
const MAX_SIDE = 640

export async function readLibreImage(file: File): Promise<string> {
  if (!TYPES.includes(file.type)) throw new Error('Choisissez une image JPG, PNG ou WebP.')
  if (file.size > MAX_SOURCE_BYTES) throw new Error('Choisissez une image de moins de 2,5 Mo.')
  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    throw new Error('Ce fichier ne contient pas une image lisible.')
  }
  try {
    const { width, height } = bitmap
    if (!width || !height || width * height > 20_000_000) throw new Error('Les dimensions de cette image sont trop grandes.')
    const fit = Math.min(1, MAX_SIDE / Math.max(width, height))
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (!context) throw new Error('La préparation de l’image est indisponible.')
    for (const scale of [fit, 0.7 * fit, 0.5 * fit]) {
      canvas.width = Math.max(1, Math.round(width * scale))
      canvas.height = Math.max(1, Math.round(height * scale))
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
      const url = canvas.toDataURL('image/webp', 0.82)
      if (url.length <= LIBRE_IMAGE_MAX_CHARS && validLibreRaster(url)) return url
    }
    throw new Error('Cette image reste trop volumineuse après redimensionnement.')
  } finally {
    bitmap.close()
  }
}
