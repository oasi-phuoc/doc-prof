import { logistiqueThemesForDomain } from './catalog'
import type { LogistiqueDomain } from './domains'
import type { LogistiqueBank } from './types'
import type { LogistiqueLevel, LogistiqueType } from './catalog'
import { diplomaForDomain, validateLogistiqueBank } from './validation'
import importedBanksJson from './imported-banks.json'
import type { LogistiqueUnit } from './types'

export type BankResolver = (domain: LogistiqueDomain, submoduleCode: string, type: LogistiqueType) => LogistiqueBank | null

type ImportedCounts = {
  modules: number
  catalogBanks: number
  populatedBanks: number
  emptyBanks: number
  uniqueUnits: number
  approvedUnits: number
  sourcePagesImported: number
  sourcePageCounts: Record<string, number>
  populatedByType: Record<string, number>
  answerBlocksByType: Record<string, number>
  unitsByStatus: Record<string, number>
  quarantineCount: number
  structuredExercises: number
  duplicateCandidates: number
}

type ImportedReport = {
  catalog: { modules: number; cfcModules: number; afpModules: number; bankSlots: number; populatedBankSlots: number; emptyBankSlots: number }
  sourcePages: { total: number; curriculumPages: number; populated: number; populatedBySlug: Record<string, number> }
  parsed: {
    answerBlocksByType: Record<string, number>
    headingsByType: Record<string, number>
    unitsByType: Record<string, number>
    unitsByStatus: Record<string, number>
    glossaryEntries: number
    structuredExercises: { sourceCount: number; imported: number; quarantined: number }
    structuredCollections: Record<string, number>
  }
  review: {
    allImportedUnitsRequirePedagogicalReview: boolean
    allEpcasReuseRightsRemainPending: boolean
    duplicateCandidates: { key: string; references: string[] }[]
    duplicateDetection: string
    blockedUnitReasons: Record<string, number>
    quarantineCount: number
    quarantineByReason: Record<string, number>
  }
}

type ImportedBanksData = {
  counts: ImportedCounts
  report: ImportedReport
  banks: Record<string, { revision: string; submoduleCode: string; type: LogistiqueType; unitIds: string[]; sourcePageIds: string[]; sourceUnitCount: number }>
  units: Record<string, LogistiqueUnit>
}

const importedBanks = importedBanksJson as ImportedBanksData
export const IMPORTED_LOGISTIQUE_COUNTS = Object.freeze(importedBanks.counts)
export const IMPORTED_LOGISTIQUE_REPORT = Object.freeze(importedBanks.report)
export const IMPORTED_LOGISTIQUE_BANKS: Readonly<Record<string, LogistiqueBank>> = Object.freeze(
  Object.fromEntries(Object.entries(importedBanks.banks).map(([key, bank]) => [key, {
    schemaVersion: 1,
    revision: bank.revision,
    submoduleCode: bank.submoduleCode,
    type: bank.type,
    sourcePageIds: bank.sourcePageIds,
    sourceUnitCount: bank.sourceUnitCount,
    units: bank.unitIds.map(id => importedBanks.units[id]).filter((unit): unit is LogistiqueUnit => Boolean(unit)),
  }])) as Record<string, LogistiqueBank>,
)

export function logistiqueBankKey(domain: LogistiqueDomain, submoduleCode: string, type: LogistiqueType): string {
  return `${domain}:${submoduleCode}:${type}`
}

export function resolveLogistiqueBank(
  domain: LogistiqueDomain,
  submoduleId: string,
  type: LogistiqueType,
  resolver: BankResolver = () => null,
): { bank: LogistiqueBank | null; diploma: LogistiqueLevel | null; submoduleCode: string | null; error: string | null } {
  const diploma = diplomaForDomain(domain)
  const submodule = logistiqueThemesForDomain(domain)
    .flatMap(theme => theme.submodules)
    .find(module => module.id === submoduleId)
  if (!diploma || !submodule) return { bank: null, diploma, submoduleCode: null, error: 'Sous-thème non éligible pour ce diplôme.' }

  const bank = resolver(domain, submodule.code, type)
  if (!bank) return { bank: null, diploma, submoduleCode: submodule.code, error: null }
  if (bank.submoduleCode !== submodule.code || bank.type !== type) {
    return { bank, diploma, submoduleCode: submodule.code, error: 'La banque ne correspond pas au sous-thème et au type sélectionnés.' }
  }
  const validation = validateLogistiqueBank(bank)
  if (validation.length) return { bank, diploma, submoduleCode: submodule.code, error: validation.join(' ') }
  return { bank, diploma, submoduleCode: submodule.code, error: null }
}
