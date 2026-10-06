import type { Domain } from '@/math/types'

/**
 * Comptes d’accès (le mot de passe détermine le rôle).
 * - admin  ← VITE_ACCESS_ADMIN  (ex. jesuisleboss)
 * - full   ← VITE_ACCESS_FULL   (ex. jebosseplus)
 * - partial← VITE_ACCESS_PARTIAL (ex. synecom)
 */
export type AccessAccount = 'admin' | 'full' | 'partial'

/** Domaines « normales » (hors TCM réservé admin). */
export const REGULAR_DOMAIN_OPTIONS: readonly { id: Domain; label: string }[] = [
  { id: 'français', label: 'Français' },
  { id: 'algèbre', label: 'Algèbre' },
  { id: 'géométrie', label: 'Géométrie' },
  { id: 'gattegno', label: 'Gattegno' },
  { id: 'jeux', label: 'Grilles de cartes' },
  { id: 'calligraphie', label: 'Calligraphie' },
  { id: 'soutien-fr', label: 'Soutien FR' },
]

/** Domaines réservés au compte admin (tests TCM / TCF). */
export const ADMIN_ONLY_DOMAINS: readonly Domain[] = ['tcm', 'tcf']

/** Tous les domaines sélectionnables (TCM et TCF inclus, sous TCM). */
export const ACCESS_DOMAIN_OPTIONS: readonly { id: Domain; label: string }[] = [
  ...REGULAR_DOMAIN_OPTIONS,
  { id: 'tcm', label: 'TCM' },
  { id: 'tcf', label: 'TCF' },
]

const REGULAR_DOMAIN_IDS: Domain[] = REGULAR_DOMAIN_OPTIONS.map((d) => d.id)
const ALL_DOMAIN_IDS: Domain[] = ACCESS_DOMAIN_OPTIONS.map((d) => d.id)

const ACCESS_COOKIE = 'clairfle-fiche-access'
const ACCESS_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

function envString(key: keyof ImportMetaEnv, fallback: string): string {
  const raw = import.meta.env[key]
  return typeof raw === 'string' && raw.trim() ? raw.trim() : fallback
}

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

function isDomain(value: unknown): value is Domain {
  return typeof value === 'string' && ALL_DOMAIN_IDS.includes(value as Domain)
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

/** Domaines FULL / PARTIAL : jamais TCM ni TCF (réservés admin). */
function domainsFromEnv(account: 'full' | 'partial'): Domain[] {
  const list =
    account === 'full'
      ? parseDomainList(import.meta.env.VITE_ACCESS_DOMAINS_FULL, [...REGULAR_DOMAIN_IDS])
      : parseDomainList(import.meta.env.VITE_ACCESS_DOMAINS_PARTIAL, [
          'algèbre',
          'géométrie',
        ])
  return list.filter((d) => !ADMIN_ONLY_DOMAINS.includes(d))
}

function adminDomainsFromEnv(): Domain[] {
  return parseDomainList(import.meta.env.VITE_ACCESS_DOMAINS_ADMIN, [...ALL_DOMAIN_IDS])
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

/** Domaines autorisés pour le compte connecté. */
export function domainsForAccount(account: AccessAccount | null): Domain[] {
  if (!account) return []
  if (account === 'admin') return adminDomainsFromEnv()
  return domainsFromEnv(account)
}

export function accountCanAccessDomain(account: AccessAccount | null, domain: Domain): boolean {
  if (ADMIN_ONLY_DOMAINS.includes(domain) && account !== 'admin') return false
  return domainsForAccount(account).includes(domain)
}
