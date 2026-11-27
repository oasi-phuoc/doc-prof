import type { Domain, ExerciseBlock } from '@/math/types'
import { isCalculationProfile, liveEditorProfile } from './profiles'
import type { SheetFormat } from '../sheet-format'

export type SpacingPreferences = Pick<ExerciseBlock, 'questionGapPx' | 'columnGapPx'>

export function spacingPreferenceKey(owner: string | undefined, domain: Domain, type: string, format: SheetFormat): string | undefined {
  if (!owner || format !== 'a4-portrait' || !['algèbre', 'géométrie'].includes(domain)) return undefined
  const profile = liveEditorProfile(domain, type, format)
  if (!isCalculationProfile(profile)) return undefined
  return `doc-prof:libre:espacement:v1:${encodeURIComponent(owner)}:${profile}`
}

const validGap = (value: unknown): value is number => typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 32

export function readSpacingPreferences(key: string | undefined): SpacingPreferences {
  if (!key) return {}
  try {
    const stored: SpacingPreferences | null = JSON.parse(localStorage.getItem(key) ?? 'null')
    return {
      questionGapPx: validGap(stored?.questionGapPx) ? stored.questionGapPx : undefined,
      columnGapPx: validGap(stored?.columnGapPx) ? stored.columnGapPx : undefined,
    }
  } catch {
    return {}
  }
}

export function rememberSpacingPreferences(key: string | undefined, patch: SpacingPreferences) {
  if (!key) return
  try {
    localStorage.setItem(key, JSON.stringify({ ...readSpacingPreferences(key), ...patch }))
  } catch {
    // Les réglages appliqués restent dans la fiche si les préférences locales sont indisponibles.
  }
}

export function spacingSectionOpen(key: string | undefined): boolean {
  if (!key) return false
  try {
    return localStorage.getItem(`${key}:section`) === 'open'
  } catch {
    return false
  }
}

export function rememberSpacingSection(key: string | undefined, open: boolean) {
  if (!key) return
  try {
    if (open) localStorage.setItem(`${key}:section`, 'open')
    else localStorage.removeItem(`${key}:section`)
  } catch {
    // L'ouverture de la section reste possible sans le stockage local.
  }
}
