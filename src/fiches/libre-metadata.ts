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
  if (!record(value)) return true
  if (value.libreSupportEdited !== undefined && (value.libreSupportEdited !== true || !record(value.support) ||
    !Array.isArray(value.questions) || !(value.competence === 'PE' || value.competence === 'PO' ||
      value.competence === 'CO' && ['association_images', 'images_a_reconnaitre'].includes(String(value.type_exercice))))) return false
  if (value.libreSupportReview !== undefined && (value.libreSupportEdited !== true || typeof value.libreSupportReview !== 'boolean')) return false
  if (!Array.isArray(value.questions)) return true
  const source = (image: unknown) => typeof image !== 'string' || !/^\s*(blob:|data:)/i.test(image) || validLibreRaster(image)
  if (value.libreSupportEdited && record(value.support)) {
    function sources(images: unknown, withId = false) {
      if (!Array.isArray(images)) return true
      const ids = new Set<string>()
      return images.every((image: unknown) => {
        if (!record(image)) return !withId && source(image)
        if (withId) {
          if (!validId(image.id) || ids.has(image.id)) return false
          ids.add(image.id)
        }
        return source(image.image)
      })
    }
    if (!source(value.support.image) || !sources(value.support.images) || !sources(value.support.mots) ||
      !sources(value.situations, true) || !sources(value.images, true)) return false
    if (Array.isArray(value.support.themes) &&
      value.support.themes.some((theme: unknown) => record(theme) && !sources(theme.images))) return false
  }
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
    if (!source(question.image) || Array.isArray(question.images) && !question.images.every(source)) return false
    if (Array.isArray(question.choix) && question.choix.some((choice: unknown) => record(choice) && !source(choice.image))) return false
    if (record(question.formes) && record(question.formes.qcm_image) && Array.isArray(question.formes.qcm_image.choix) &&
      question.formes.qcm_image.choix.some((choice: unknown) => record(choice) && !source(choice.image))) return false
  }
  return !ids.size || !record(value.support) || source(value.support.image)
}

/** Optional v1 extension. Older v1 readers preserve the fields inside page objects. */
export function validLibreMetadata(pages: readonly unknown[]): boolean {
  const activities = new Set<string>()
  function validItems(items: unknown[], activityId: unknown) {
    const ids = new Set<string>()
    return items.every((item: unknown) => {
      if (!record(item)) return false
      if (item.libreId !== undefined) {
        if (!validId(item.libreId) || ids.has(item.libreId)) return false
        ids.add(item.libreId)
      }
      if (item.libreCorrectionPending !== undefined &&
        (!validId(activityId) || !validId(item.libreId) || typeof item.libreCorrectionPending !== 'boolean')) return false
      return item.libreLocked === undefined ||
        (validId(activityId) && validId(item.libreId) && typeof item.libreLocked === 'boolean')
    })
  }
  function registerActivity(id: unknown) {
    if (!validId(id) || activities.has(id)) return false
    activities.add(id)
    return true
  }
  function validActivity(block: unknown) {
    if (!record(block) || !validTcfMetadata(block.tcfExercise)) return false
    for (const gap of [block.questionGapPx, block.columnGapPx]) {
      if (gap !== undefined && (typeof gap !== 'number' || !Number.isInteger(gap) || gap < 0 || gap > 32)) return false
    }
    if (Array.isArray(block.coordQuestionsLibre)) {
      const questions = new Set<string>()
      for (const question of block.coordQuestionsLibre as unknown[]) {
        if (!record(question) || (question.libreId === undefined && question.correctionPending === undefined)) continue
        if (!validId(question.libreId) || questions.has(question.libreId) ||
          typeof question.prompt !== 'string' || typeof question.answer !== 'string' ||
          (question.correctionPending !== undefined && typeof question.correctionPending !== 'boolean')) return false
        questions.add(question.libreId)
      }
    }
    if (block.libreId !== undefined && !registerActivity(block.libreId)) return false
    for (const entries of [block.soutienMotsEntries, block.soutienCompleterEntries]) {
      if (Array.isArray(entries) && entries.some((entry: unknown) => record(entry) && entry.libreImage !== undefined &&
        (entry.libreImage !== true || typeof entry.id !== 'string' || !validLibreRaster(entry.imageSrc)))) return false
      if (Array.isArray(entries) && entries.some((entry: unknown) => record(entry) && entry.imageHidden !== undefined &&
        (entry.imageHidden !== true || entry.imageSrc !== undefined || entry.libreImage !== undefined))) return false
    }
    if (block.a5RightLibre !== undefined) {
      const right = block.a5RightLibre
      if (!record(right) || !registerActivity(right.id) || !Array.isArray(right.items) ||
        !right.items.length || right.items.length > 100 ||
        (right.instruction !== undefined && typeof right.instruction !== 'string') || !validItems(right.items, right.id)) return false
    }
    const items = block.libreItems
    return Array.isArray(items) ? validItems(items, block.libreId) : block.libreId === undefined || items === undefined
  }
  return pages.every((page) =>
    validActivity(page) && record(page) &&
    (page.extraBlocks == null || (Array.isArray(page.extraBlocks) && page.extraBlocks.every(validActivity))),
  )
}
