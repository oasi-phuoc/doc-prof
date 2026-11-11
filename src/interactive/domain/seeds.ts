export const CONVERSION_VERSION = 2
export type SeedPurpose = 'distractors' | 'slots' | 'order' | 'replay'

/** FNV-1a over the source's UTF-16 character units; identity only, never security. */
export function hash(value: string): number {
  let h = 2166136261
  for (let i = 0; i < value.length; i++) h = Math.imul(h ^ value.charCodeAt(i), 16777619)
  return h >>> 0
}

/** Stable JSON keys and NFC text keep equivalent source content identical. */
export function canonicalJson(value: unknown): string {
  const normalize = (item: unknown): unknown => {
    if (typeof item === 'string') return item.normalize('NFC')
    if (typeof item === 'number' && !Number.isFinite(item)) throw new Error('Le contenu contient un nombre invalide.')
    if (Array.isArray(item)) return item.map(normalize)
    if (item && typeof item === 'object') return Object.fromEntries(Object.keys(item).sort().map((key) => [key, normalize((item as Record<string, unknown>)[key])]))
    return item
  }
  const json = JSON.stringify(normalize(value))
  if (json === undefined) throw new Error('Le contenu ne peut pas être identifié.')
  return json
}

export function deriveSeed({ originalSeed, sourceKey, conversionVersion = CONVERSION_VERSION, purpose, attempt = 0 }: { originalSeed: number; sourceKey: string; conversionVersion?: number; purpose: SeedPurpose; attempt?: number }): number {
  return hash(`${originalSeed}|${sourceKey.normalize('NFC')}|v${conversionVersion}|${purpose}|${attempt}`)
}
