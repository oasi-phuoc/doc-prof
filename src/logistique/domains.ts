import type { Domain } from '@/math/types'
import epcaLogo from '@/assets/logos/epca.svg'

export type LogistiqueDomain = 'logistique-cfc' | 'logistique-afp'

export const LOGISTIQUE_DOMAIN_OPTIONS: readonly { id: LogistiqueDomain; label: string }[] = [
  { id: 'logistique-afp', label: 'Logistique AFP' },
  { id: 'logistique-cfc', label: 'Logistique CFC' },
]

export const EPCA_LOGO_SRC = epcaLogo

export function isLogistiqueDomain(domain: string | undefined): domain is LogistiqueDomain {
  return domain === 'logistique-cfc' || domain === 'logistique-afp'
}

export function logistiqueDomainLabel(domain: LogistiqueDomain): string {
  return domain === 'logistique-cfc' ? 'Logistique CFC' : 'Logistique AFP'
}

/** Aucun cours ni exercice n’est activé dans cette première étape. */
export function worksheetDomainFor(domain: Domain, fallback: Domain): Domain {
  return isLogistiqueDomain(domain) ? fallback : domain
}
