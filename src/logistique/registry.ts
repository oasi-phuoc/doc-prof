import { logistiqueThemesForDomain } from './catalog'
import type { LogistiqueDomain } from './domains'
import type { LogistiqueBank } from './types'
import type { LogistiqueLevel, LogistiqueType } from './catalog'
import { diplomaForDomain, validateLogistiqueBank } from './validation'

export type BankResolver = (domain: LogistiqueDomain, submoduleCode: string, type: LogistiqueType) => LogistiqueBank | null

/** No runtime bank is enabled until its source and pedagogical review are recorded. */
export const EMPTY_LOGISTIQUE_BANKS: Readonly<Record<string, LogistiqueBank>> = Object.freeze({})

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
