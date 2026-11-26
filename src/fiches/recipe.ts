import { freezeLogistiquePages, validLogistiquePages } from '@/logistique/recipe'
import {hasRetiredGrammarRecipe} from '@/grammaire/curriculum/retirement'
import type { InstitutionalHeader } from '@/components/math/PrintDocumentChrome'
import { isSheetFontId, type SheetFontId } from '@/typography/font-ids'
import type { SheetFormat } from '@/components/generator/sheet-format'
import type { Domain, PageConfig } from '@/math/types'
import { normalizeLegacyPhraseBlock } from '@/francais/phrase-themes'
import { normalizeGrammarCoBlock } from '@/grammaire/exercises/co-themes'
import { freezeGrammarPages, validGrammarRecipePages } from '@/grammaire/curriculum/recipe'
import { readSessionUser } from '@/fiches/session'
import { normalizeFicheAuthor } from '@/fiches/author'

/** Recette qui reproduit la fiche imprimée : config, graine, en-tête, points. */
export type FicheRecipe = {
  version: 1
  /** Personne qui a effectué le dernier enregistrement, conservée dans D1 avec la recette. */
  savedBy?: string
  pages: PageConfig[]
  seed: number
  institutional: InstitutionalHeader
  evalMode: boolean
  pointsPerQuestion: number
  libreMode: boolean
  libreSnapshot: PageConfig[] | null
  /** Livre complet : la graine reconstruit toutes les lettres. */
  bookKind?: 'alpha' | 'soutien'
  /** Format de feuille (portrait A4 ou paysage double A5). */
  sheetFormat?: SheetFormat
  sheetFont?: SheetFontId
  /** Masque en-tête et pied : exercices seulement. */
  hideChrome?: boolean
  /** Inclut le corrigé à l’impression ; activé par défaut pour les anciennes fiches. */
  printCorrections?: boolean
  /** Remplacements d’images provenant de la banque ; fichiers temporaires exclus. */
  imageOverrides?: Record<string, string>
}

export type SavedFiche = {
  id: string
  name: string
  domains: Domain[]
  createdAt: string
  updatedAt: string
  recipe: FicheRecipe
}

export type StagedFiche = {
  id: string
  name: string
  recipe: FicheRecipe
}

const HISTORY_KEY = 'clairfleFiche'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isPage(value: unknown): value is PageConfig {
  if (!isRecord(value)) return false
  return typeof value.domain === 'string' && typeof value.exerciseType === 'string'
}

/** Ancien domaine TCF → TPF. */
export function migrateTpfToken(value: string): string {
  if (value === 'tcf') return 'tpf'
  return value
}

export function migrateDomainToken(value: string): string {
  return migrateTpfToken(migrateTpmToken(value))
}

/**
 * Ancien code du test principal (`tcm` → `tpm`).
 * TCM CSC et TCM CFR restent `tcm-csc` / `tcm-cfr`.
 */
export function migrateTpmToken(value: string): string {
  if (value === 'tpm-csc' || value.startsWith('tpm-csc-') || value.startsWith('tpm-csc_')) {
    return `tcm${value.slice(3)}`
  }
  if (value === 'tpm-cfr' || value.startsWith('tpm-cfr-') || value.startsWith('tpm-cfr_')) {
    return `tcm${value.slice(3)}`
  }
  if (value === 'tcm_csc') return 'tcm-csc'
  if (value === 'tcm_cfr') return 'tcm-cfr'
  if (
    value === 'tcm-csc' ||
    value.startsWith('tcm-csc-') ||
    value.startsWith('tcm-csc_') ||
    value === 'tcm-cfr' ||
    value.startsWith('tcm-cfr-') ||
    value.startsWith('tcm-cfr_')
  ) {
    return value
  }
  if (value === 'tcm' || value.startsWith('tcm-') || value.startsWith('tcm_')) {
    return `tpm${value.slice(3)}`
  }
  return value
}

function migratePage(page: PageConfig): PageConfig {
  const extra = page.extraBlocks?.map((block) => {
    const migrated = {
      ...block,
      topic: migrateDomainToken(block.topic),
      exerciseType: migrateDomainToken(block.exerciseType),
    }
    return page.domain === 'gattegno' ? normalizeLegacyPhraseBlock(migrated)
      : page.domain === 'grammaire' ? normalizeGrammarCoBlock(migrated) : migrated
  })
  const migrated = {
    ...page,
    domain: migrateDomainToken(page.domain) as Domain,
    topic: migrateDomainToken(page.topic),
    exerciseType: migrateDomainToken(page.exerciseType),
    extraBlocks: extra,
  }
  return migrated.domain === 'gattegno' ? normalizeLegacyPhraseBlock(migrated)
    : migrated.domain === 'grammaire' ? normalizeGrammarCoBlock(migrated) : migrated
}

export function parseFicheRecipe(value: unknown): FicheRecipe | null {
  if (!isRecord(value) || value.version !== 1 || hasRetiredGrammarRecipe(value)) return null
  if (!Array.isArray(value.pages) || value.pages.length === 0 || value.pages.length > 60) return null
  if (!value.pages.every(isPage)) return null
  if (typeof value.seed !== 'number' || !Number.isFinite(value.seed)) return null
  if (!isRecord(value.institutional)) return null
  if (typeof value.evalMode !== 'boolean') return null
  if (typeof value.pointsPerQuestion !== 'number' || !Number.isFinite(value.pointsPerQuestion)) {
    return null
  }
  if (typeof value.libreMode !== 'boolean') return null
  if (value.libreSnapshot !== null) {
    if (!Array.isArray(value.libreSnapshot) || !value.libreSnapshot.every(isPage)) return null
  }
  const pages = (value.pages as PageConfig[]).map(migratePage)
  if (!validGrammarRecipePages(pages,value.seed) || !validLogistiquePages(pages)) return null
  const snapshot = (value.libreSnapshot as PageConfig[] | null) ?? null
  if (snapshot && (!validGrammarRecipePages(snapshot,value.seed) || !validLogistiquePages(snapshot))) return null
  const sheetFormat =
    value.sheetFormat === 'a5-double-landscape' || value.sheetFormat === 'a4-portrait'
      ? value.sheetFormat
      : undefined
  const hideChrome = value.hideChrome === true ? true : value.hideChrome === false ? false : undefined
  return {
    version: 1,
    savedBy: normalizeFicheAuthor(value.savedBy) || undefined,
    pages,
    seed: value.seed,
    institutional: value.institutional as InstitutionalHeader,
    evalMode: value.evalMode,
    pointsPerQuestion: value.pointsPerQuestion,
    libreMode: value.libreMode,
    libreSnapshot: snapshot ? snapshot.map(migratePage) : null,
    bookKind: value.bookKind === 'alpha' || value.bookKind === 'soutien' ? value.bookKind : undefined,
    sheetFormat,
    sheetFont: isSheetFontId(value.sheetFont) ? value.sheetFont : undefined,
    hideChrome,
    printCorrections: value.printCorrections !== false,
    imageOverrides: isRecord(value.imageOverrides)
      ? Object.fromEntries(Object.entries(value.imageOverrides).filter(([key, image]) => key && typeof image === 'string' && image.startsWith('/lib/images/'))) as Record<string, string>
      : undefined,
  }
}

export function parseStagedFiche(value: unknown): StagedFiche | null {
  if (!isRecord(value)) return null
  if (typeof value.id !== 'string' || typeof value.name !== 'string') return null
  const user = readSessionUser()
  if (user ? value.sessionOwner !== user.id : typeof value.sessionOwner === 'string') return null
  const recipe = parseFicheRecipe(value.recipe)
  if (!recipe) return null
  return { id: value.id, name: value.name, recipe }
}

export function buildFicheRecipe(input: {
  savedBy?: string
  pages: PageConfig[]
  seed: number
  institutional: InstitutionalHeader
  evalMode: boolean
  pointsPerQuestion: number
  libreMode: boolean
  libreSnapshot: PageConfig[] | null
  bookKind?: 'alpha' | 'soutien'
  sheetFormat?: SheetFormat
  sheetFont?: SheetFontId
  hideChrome?: boolean
  printCorrections?: boolean
  /** Remplacements d’images provenant de la banque ; fichiers temporaires exclus. */
  imageOverrides?: Record<string, string>
}): FicheRecipe {
  return { version: 1, ...input, pages:freezeLogistiquePages(freezeGrammarPages(input.pages,input.seed)),
    libreSnapshot:input.libreSnapshot ? freezeLogistiquePages(freezeGrammarPages(input.libreSnapshot,input.seed)) : null }
}

export function domainsOfPages(pages: readonly { domain?: string }[]): Domain[] {
  const domains: Domain[] = []
  for (const page of pages) {
    const domain = page.domain
    if (!domain || domains.includes(domain as Domain)) continue
    domains.push(domain as Domain)
  }
  return domains
}

/** Ouvre le générateur avec cette fiche dans l’historique de navigation. */
export function stageFicheNavigation(fiche: StagedFiche) {
  window.history.pushState({ [HISTORY_KEY]: { ...fiche, sessionOwner: readSessionUser()?.id ?? null } }, '', '/generateur')
}

export function readStagedFiche(): StagedFiche | null {
  if (typeof window === 'undefined') return null
  const state = window.history.state
  if (!isRecord(state)) return null
  return parseStagedFiche(state[HISTORY_KEY])
}

export function rememberFicheOnHistory(fiche: StagedFiche) {
  const current = isRecord(window.history.state) ? window.history.state : {}
  window.history.replaceState({ ...current, [HISTORY_KEY]: { ...fiche, sessionOwner: readSessionUser()?.id ?? null } }, '', window.location.pathname)
}
