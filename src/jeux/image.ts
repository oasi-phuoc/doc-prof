/** Lecture et validation des images utilisateur pour les fiches-jeux. */

export const GAME_IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp,image/svg+xml,.jpg,.jpeg,.png,.webp,.svg'

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])

/** Taille max avant redimensionnement / refus (Mo). */
export const GAME_IMAGE_MAX_BYTES = 2_500_000

/** Plus grand côté après redimensionnement (px). */
const MAX_EDGE = 800

export function isAllowedGameImage(file: File): boolean {
  if (ALLOWED_TYPES.has(file.type)) return true
  const name = file.name.toLowerCase()
  return /\.(jpe?g|png|webp|svg)$/.test(name)
}

/**
 * Lit un fichier image en data URL.
 * JPG / PNG / WebP sont recentrés/recadrés via canvas (object-fit cover côté rendu) ;
 * SVG et petits fichiers passent en data URL directe.
 */
export async function readGameImageFile(file: File): Promise<string> {
  if (!isAllowedGameImage(file)) {
    throw new Error('Formats acceptés : JPG, PNG, WebP, SVG.')
  }
  if (file.size > GAME_IMAGE_MAX_BYTES) {
    throw new Error('Image trop lourde (max. 2,5 Mo).')
  }

  const isSvg = file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')
  if (isSvg || file.size < 120_000) {
    return readAsDataUrl(file)
  }

  try {
    return await downscaleToDataUrl(file)
  } catch {
    return readAsDataUrl(file)
  }
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result ?? '')
      if (!result.startsWith('data:')) {
        reject(new Error('Lecture impossible.'))
        return
      }
      resolve(result)
    }
    reader.onerror = () => reject(new Error('Lecture impossible.'))
    reader.readAsDataURL(file)
  })
}

function downscaleToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      const { width, height } = img
      if (!width || !height) {
        reject(new Error('Image invalide.'))
        return
      }
      const scale = Math.min(1, MAX_EDGE / Math.max(width, height))
      const w = Math.max(1, Math.round(width * scale))
      const h = Math.max(1, Math.round(height * scale))
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Canvas indisponible.'))
        return
      }
      ctx.drawImage(img, 0, 0, w, h)
      const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
      resolve(canvas.toDataURL(mime, 0.85))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Image invalide.'))
    }
    img.src = url
  })
}
