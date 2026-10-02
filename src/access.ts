import type { Domain } from '@/math/types'

/** Compte reconnu par le mot de passe (pas d’identifiant). */
export type AccessAccount = 'jebosseplus' | 'synecom' | 'admin'

/** Comptes dont les domaines sont configurables par l’admin. */
export type ConfigurableAccount = 'jebosseplus' | 'synecom'

export const ACCESS_PASSWORDS: Readonly<Record<string, AccessAccount>> = {
  jebosseplus: 'jebosseplus',
  synecom: 'synecom',
  jesuisleboss: 'admin',
}

export const ACCOUNT_LABELS: Readonly<Record<AccessAccount, string>> = {
  jebosseplus: 'jebosseplus',
  synecom: 'synecom',
  admin: 'Admin',
}

/** Domaines proposés dans le générateur (hors Lecture masquée). */
export const ACCESS_DOMAIN_OPTIONS: readonly { id: Domain; label: string }[] = [
  { id: 'français', label: 'Français' },
  { id: 'algèbre', label: 'Algèbre' },
  { id: 'géométrie', label: 'Géométrie' },
  { id: 'gattegno', label: 'Gattegno' },
  { id: 'jeux', label: 'Grilles de cartes' },
  { id: 'calligraphie', label: 'Calligraphie' },
  { id: 'soutien-fr', label: 'Soutien FR' },
]

const ALL_DOMAIN_IDS: Domain[] = ACCESS_DOMAIN_OPTIONS.map((d) => d.id)

export type DomainGrants = Record<ConfigurableAccount, Domain[]>

const DEFAULT_GRANTS: DomainGrants = {
  jebosseplus: [...ALL_DOMAIN_IDS],
  synecom: ['algèbre', 'géométrie'],
}

const ACCESS_COOKIE = 'clairfle-fiche-access'
const ACCESS_COOKIE_MAX_AGE = 60 * 60 * 24 * 365
const GRANTS_STORAGE_KEY = 'clairfle-domain-grants'

function isDomain(value: unknown): value is Domain {
  return typeof value === 'string' && ALL_DOMAIN_IDS.includes(value as Domain)
}

function isConfigurableAccount(value: string): value is ConfigurableAccount {
  return value === 'jebosseplus' || value === 'synecom'
}

export function resolveAccountFromPassword(password: string): AccessAccount | null {
  const key = password.trim()
  return ACCESS_PASSWORDS[key] ?? null
}

export function readAccessAccount(): AccessAccount | null {
  if (typeof document === 'undefined') return null
  for (const part of document.cookie.split(';')) {
    const trimmed = part.trim()
    if (!trimmed.startsWith(`${ACCESS_COOKIE}=`)) continue
    const value = decodeURIComponent(trimmed.slice(ACCESS_COOKIE.length + 1))
    // Ancien cookie (=1) → accès complet historique.
    if (value === '1' || value === 'jebosseplus') return 'jebosseplus'
    if (value === 'synecom') return 'synecom'
    if (value === 'admin') return 'admin'
  }
  return null
}

export function writeAccessAccount(account: AccessAccount) {
  document.cookie = `${ACCESS_COOKIE}=${encodeURIComponent(account)}; path=/; max-age=${ACCESS_COOKIE_MAX_AGE}; SameSite=Lax`
}

export function clearAccessAccount() {
  document.cookie = `${ACCESS_COOKIE}=; path=/; max-age=0; SameSite=Lax`
}

export function hasAccessCookie(): boolean {
  return readAccessAccount() != null
}

export function readDomainGrants(): DomainGrants {
  if (typeof localStorage === 'undefined') return structuredClone(DEFAULT_GRANTS)
  try {
    const raw = localStorage.getItem(GRANTS_STORAGE_KEY)
    if (!raw) return structuredClone(DEFAULT_GRANTS)
    const parsed = JSON.parse(raw) as Partial<Record<ConfigurableAccount, unknown>>
    const next: DomainGrants = structuredClone(DEFAULT_GRANTS)
    for (const account of ['jebosseplus', 'synecom'] as const) {
      const list = parsed[account]
      if (!Array.isArray(list)) continue
      const domains = list.filter(isDomain)
      if (domains.length > 0) next[account] = domains
    }
    return next
  } catch {
    return structuredClone(DEFAULT_GRANTS)
  }
}

export function writeDomainGrants(grants: DomainGrants) {
  localStorage.setItem(GRANTS_STORAGE_KEY, JSON.stringify(grants))
}

/** Domaines autorisés pour le compte connecté. */
export function domainsForAccount(account: AccessAccount | null): Domain[] {
  if (!account) return []
  if (account === 'admin') return [...ALL_DOMAIN_IDS]
  const grants = readDomainGrants()
  const allowed = grants[account]?.filter(isDomain) ?? []
  return allowed.length > 0 ? allowed : [...DEFAULT_GRANTS[account]]
}

export function accountCanAccessDomain(account: AccessAccount | null, domain: Domain): boolean {
  return domainsForAccount(account).includes(domain)
}

export function toggleDomainGrant(
  grants: DomainGrants,
  account: ConfigurableAccount,
  domain: Domain,
): DomainGrants {
  const current = new Set(grants[account])
  if (current.has(domain)) {
    if (current.size <= 1) return grants // au moins un domaine
    current.delete(domain)
  } else {
    current.add(domain)
  }
  return {
    ...grants,
    [account]: ALL_DOMAIN_IDS.filter((id) => current.has(id)),
  }
}

export function isConfigurableAccountId(value: string): value is ConfigurableAccount {
  return isConfigurableAccount(value)
}
