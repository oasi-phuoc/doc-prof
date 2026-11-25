import { logistiqueThemesForDomain } from './catalog'
import type { LogistiqueDomain } from './domains'
import type { LogistiqueBank } from './types'
import type { LogistiqueLevel, LogistiqueType } from './catalog'
import { diplomaForDomain, validateLogistiqueBank } from './validation'
import importedBanksJson from './imported-banks.json'
import type { LogistiqueUnit } from './types'

export type BankResolver = (domain: LogistiqueDomain, submoduleCode: string, type: LogistiqueType) => LogistiqueBank | null

type ImportedBanksData = {
  banks: Record<string, { revision: string; submoduleCode: string; type: LogistiqueType; unitIds: string[] }>
  units: Record<string, LogistiqueUnit>
}

const importedBanks = importedBanksJson as ImportedBanksData
export const IMPORTED_LOGISTIQUE_BANKS: Readonly<Record<string, LogistiqueBank>> = Object.freeze(
  Object.fromEntries(Object.entries(importedBanks.banks).map(([key, bank]) => [key, {
    schemaVersion: 1,
    revision: bank.revision,
    submoduleCode: bank.submoduleCode,
    type: bank.type,
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
