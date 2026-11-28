import type { Domain } from '@/math/types'

/** Vis-à-vis (3 cm / 1 cm) ou marges égales (2 cm). */
export type SheetMargin = 'facing' | 'symmetric'

const TEST_DOMAINS = new Set<Domain>([
  'tpf',
  'tcf-csc',
  'tcf-cfr',
  'tcf-b1',
  'tpm',
  'tcm-csc',
  'tcm-cfr',
])

const BORDER_KEY = 'clairfle-page-border'
const MARGIN_KEY = 'clairfle-sheet-margin'

export function isTestSheetDomain(domain: string | undefined): boolean {
  return domain != null && TEST_DOMAINS.has(domain as Domain)
}

function family(domain: string | undefined): 'test' | 'other' {
  return isTestSheetDomain(domain) ? 'test' : 'other'
}

export function defaultPageBorder(domain?: string): boolean {
  return isTestSheetDomain(domain)
}

export function defaultSheetMargin(domain?: string): SheetMargin {
  return isTestSheetDomain(domain) ? 'symmetric' : 'facing'
}

export function readPageBorder(domain?: string): boolean {
  try {
    const stored = window.localStorage.getItem(`${BORDER_KEY}:${family(domain)}`)
    if (stored === '0') return false
    if (stored === '1') return true
    return defaultPageBorder(domain)
  } catch (error) {
    console.warn('Impossible de lire le cadre de page.', error)
    return defaultPageBorder(domain)
  }
}

export function storePageBorder(on: boolean, domain?: string) {
  try {
    window.localStorage.setItem(`${BORDER_KEY}:${family(domain)}`, on ? '1' : '0')
  } catch (error) {
    console.warn('Impossible d’enregistrer le cadre de page.', error)
  }
}

export function readSheetMargin(domain?: string): SheetMargin {
  try {
    const stored = window.localStorage.getItem(`${MARGIN_KEY}:${family(domain)}`)
    if (stored === 'facing' || stored === 'symmetric') return stored
    return defaultSheetMargin(domain)
  } catch (error) {
    console.warn('Impossible de lire les marges.', error)
    return defaultSheetMargin(domain)
  }
}

export function storeSheetMargin(mode: SheetMargin, domain?: string) {
  try {
    window.localStorage.setItem(`${MARGIN_KEY}:${family(domain)}`, mode)
  } catch (error) {
    console.warn('Impossible d’enregistrer les marges.', error)
  }
}

export function applySheetChrome(border: boolean, margin: SheetMargin) {
  const root = document.documentElement
  root.classList.toggle('has-page-border', border)
  root.classList.toggle('is-margin-facing', margin === 'facing')
  root.classList.toggle('is-margin-symmetric', margin === 'symmetric')
}
