import type { Domain } from '@/math/types'

/**
 * Comptes d’accès (le mot de passe détermine le rôle).
 * - admin  ← VITE_ACCESS_ADMIN  (ex. jesuisleboss)
 * - full   ← VITE_ACCESS_FULL   (ex. jebosseplus)
 * - partial← VITE_ACCESS_PARTIAL (ex. synecom)
 */
export type AccessAccount = 'admin' | 'full' | 'partial'

/** Comptes dont les domaines sont définis par env (et surcharge locale optionnelle). */
export type ConfigurableAccount = 'full' | 'partial'

export const ACCOUNT_LABELS: Readonly<Record<AccessAccount, string>> = {
  admin: 'Admin',
  full: 'FULL',
  partial: 'PARTIAL',
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

const ACCESS_COOKIE = 'clairfle-fiche-access'
const ACCESS_COOKIE_MAX_AGE = 60 * 60 * 24 * 365
const GRANTS_STORAGE_KEY = 'clairfle-domain-grants'

function envString(key: keyof ImportMetaEnv, fallback: string): string {
  const raw = import.meta.env[key]
  return typeof raw === 'string' && raw.trim() ? raw.trim() : fallback
}

/** Mots de passe (visibles dans le bundle client — comme avant en dur). */
function passwordMap(): Readonly<Record<string, AccessAccount>> {
  const admin = envString('VITE_ACCESS_ADMIN', 'jesuisleboss')
  const full = envString('VITE_ACCESS_FULL', 'jebosseplus')
  const partial = envString('VITE_ACCESS_PARTIAL', 'synecom')
  return {
    [admin]: 'admin',
    [full]: 'full',
    [partial]: 'partial',
  }
}

function parseDomainList(raw: string | undefined, fallback: Domain[]): Domain[] {
  if (!raw?.trim()) return [...fallback]
  const parts = raw
    .split(/[,;|]/)
    .map((part) => part.trim())
    .filter(Boolean)
  const domains = parts.filter(isDomain)
  return domains.length > 0 ? domains : [...fallback]
}

/** Droits par défaut : variables d’env (partagés après redéploiement). */
export function envDomainGrants(): DomainGrants {
  return {
    full: parseDomainList(
      import.meta.env.VITE_ACCESS_DOMAINS_FULL,
      [...ALL_DOMAIN_IDS],
    ),
    partial: parseDomainList(import.meta.env.VITE_ACCESS_DOMAINS_PARTIAL, [
      'algèbre',
      'géométrie',
    ]),
  }
}

function isDomain(value: unknown): value is Domain {
  return typeof value === 'string' && ALL_DOMAIN_IDS.includes(value as Domain)
}

export function resolveAccountFromPassword(password: string): AccessAccount | null {
  const key = password.trim()
  return passwordMap()[key] ?? null
}

export function readAccessAccount(): AccessAccount | null {
  if (typeof document === 'undefined') return null
  for (const part of document.cookie.split(';')) {
    const trimmed = part.trim()
    if (!trimmed.startsWith(`${ACCESS_COOKIE}=`)) continue
    const value = decodeURIComponent(trimmed.slice(ACCESS_COOKIE.length + 1))
    // Anciens cookies → nouveaux rôles.
    if (value === '1' || value === 'jebosseplus' || value === 'full') return 'full'
    if (value === 'synecom' || value === 'partial') return 'partial'
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

/** true si une surcharge locale (cet appareil) est active. */
export function hasLocalDomainGrantsOverride(): boolean {
  if (typeof localStorage === 'undefined') return false
  return Boolean(localStorage.getItem(GRANTS_STORAGE_KEY))
}

/**
 * Droits effectifs : surcharge localStorage (cet appareil) sinon variables d’env.
 * Les env s’appliquent à tous les ordinateurs après redéploiement Vercel.
 */
export function readDomainGrants(): DomainGrants {
  const fromEnv = envDomainGrants()
  if (typeof localStorage === 'undefined') return fromEnv
  try {
    const raw = localStorage.getItem(GRANTS_STORAGE_KEY)
    if (!raw) return fromEnv
    const parsed = JSON.parse(raw) as Partial<Record<string, unknown>>
    const next: DomainGrants = { ...fromEnv }
    for (const account of ['full', 'partial'] as const) {
      // Migration anciennes clés jebosseplus / synecom.
      const legacyKey = account === 'full' ? 'jebosseplus' : 'synecom'
      const list = parsed[account] ?? parsed[legacyKey]
      if (!Array.isArray(list)) continue
      const domains = list.filter(isDomain)
      if (domains.length > 0) next[account] = domains
    }
    return next
  } catch {
    return fromEnv
  }
}

export function writeDomainGrants(grants: DomainGrants) {
  localStorage.setItem(GRANTS_STORAGE_KEY, JSON.stringify(grants))
}

/** Repart des variables d’environnement (tous les postes après deploy). */
export function clearLocalDomainGrantsOverride() {
  localStorage.removeItem(GRANTS_STORAGE_KEY)
}

/** Domaines autorisés pour le compte connecté. */
export function domainsForAccount(account: AccessAccount | null): Domain[] {
  if (!account) return []
  if (account === 'admin') return [...ALL_DOMAIN_IDS]
  const grants = readDomainGrants()
  const allowed = grants[account]?.filter(isDomain) ?? []
  return allowed.length > 0 ? allowed : [...envDomainGrants()[account]]
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
    if (current.size <= 1) return grants
    current.delete(domain)
  } else {
    current.add(domain)
  }
  return {
    ...grants,
    [account]: ALL_DOMAIN_IDS.filter((id) => current.has(id)),
  }
}

/** Chaîne prête à coller dans Vercel (VITE_ACCESS_DOMAINS_*). */
export function domainsToEnvValue(domains: readonly Domain[]): string {
  return domains.join(',')
}
