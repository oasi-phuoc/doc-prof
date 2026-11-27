export const LIBRE_IMAGE_MAX_CHARS = 120_000
export const FICHE_BODY_MAX_CHARS = 800_000

export function validLibreRaster(value: unknown): boolean {
  if (typeof value !== 'string' || value.length > LIBRE_IMAGE_MAX_CHARS) return false
  const parts = /^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(value)
  if (!parts || parts[2].length % 4 !== 0) return false
  const head = atob(parts[2].slice(0, 24))
  if (parts[1] === 'png') return head.startsWith('\x89PNG\r\n\x1a\n')
  if (parts[1] === 'jpeg') return head.startsWith('\xff\xd8\xff')
  return head.startsWith('RIFF') && head.slice(8, 12) === 'WEBP'
}

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function validId(id: unknown): id is string {
  return typeof id === 'string' && /^[a-zA-Z0-9_-]{1,128}$/.test(id)
}

function validTcfMetadata(value: unknown): boolean {
  if (!record(value) || !Array.isArray(value.questions)) return true
  const source = (image: unknown) => typeof image !== 'string' || !image.startsWith('data:') || validLibreRaster(image)
  const ids = new Set<string>()
  for (const question of value.questions as unknown[]) {
    if (!record(question)) continue
    if (question.libreId === undefined && question.libreLocked === undefined && question.correctionARevoir === undefined &&
      question.libreSourceKey === undefined) continue
    if (!validId(question.libreId) || ids.has(question.libreId)) return false
    ids.add(question.libreId)
    if (typeof question.enonce !== 'string') return false
    if (!['qcm_texte', 'qcm_image', 'lignes'].includes(String(question.type_reponse))) return false
    if (question.type_reponse !== 'lignes' && (!Array.isArray(question.choix) ||
      !question.choix.every((choice: unknown) => record(choice) && validId(choice.id) &&
        typeof (question.type_reponse === 'qcm_image' ? choice.image : choice.texte) === 'string'))) return false
    if (question.libreLocked !== undefined && typeof question.libreLocked !== 'boolean') return false
    if (question.correctionARevoir !== undefined && typeof question.correctionARevoir !== 'boolean') return false
    if (question.libreSourceKey !== undefined && typeof question.libreSourceKey !== 'string') return false
    if (!source(question.image)) return false
    if (Array.isArray(question.choix) && question.choix.some((choice: unknown) => record(choice) && !source(choice.image))) return false
    if (record(question.formes) && record(question.formes.qcm_image) && Array.isArray(question.formes.qcm_image.choix) &&
      question.formes.qcm_image.choix.some((choice: unknown) => record(choice) && !source(choice.image))) return false
  }
  return !ids.size || !record(value.support) || source(value.support.image)
}

/** Optional v1 extension. Older v1 readers preserve the fields inside page objects. */
export function validLibreMetadata(pages: readonly unknown[]): boolean {
  const activities = new Set<string>()
  function validActivity(block: unknown) {
    if (!record(block) || !validTcfMetadata(block.tcfExercise)) return false
    if (block.libreId !== undefined) {
      if (!validId(block.libreId) || activities.has(block.libreId)) return false
      activities.add(block.libreId)
    }
    const items = block.libreItems
    if (!Array.isArray(items)) return block.libreId === undefined || items === undefined
    const ids = new Set<string>()
    return items.every((item: unknown) => {
      if (!record(item)) return false
      if (item.libreId !== undefined) {
        if (!validId(item.libreId) || ids.has(item.libreId)) return false
        ids.add(item.libreId)
      }
      return item.libreLocked === undefined ||
        (validId(block.libreId) && validId(item.libreId) && typeof item.libreLocked === 'boolean')
    })
  }
  return pages.every((page) =>
    validActivity(page) && record(page) &&
    (page.extraBlocks == null || (Array.isArray(page.extraBlocks) && page.extraBlocks.every(validActivity))),
  )
}
