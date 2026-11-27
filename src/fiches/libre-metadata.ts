function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function validId(id: unknown): id is string {
  return typeof id === 'string' && /^[a-zA-Z0-9_-]{1,128}$/.test(id)
}

/** Optional v1 extension. Older v1 readers preserve the fields inside page objects. */
export function validLibreMetadata(pages: readonly unknown[]): boolean {
  const activities = new Set<string>()
  function validActivity(block: unknown) {
    if (!record(block)) return false
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
