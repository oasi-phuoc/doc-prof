import type { AccessAccount } from '@/access'
import { rememberFicheAuthor } from '@/fiches/author'
import { clearAccessPassword, readAccessPassword, rememberAccessPassword } from '@/fiches/password'
export type SessionUser = { id: string; givenName: string; familyName: string; email: string; account: AccessAccount; domains: string[] }
const PROFILE_KEY = 'clairfle-personal-session'
export function readSessionUser(): SessionUser | null {
 try {
  const stored = JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null')
  if (!stored || !readAccessPassword()?.startsWith('cfu_') || stored.expiresAt <= Date.now()) return null
  return stored.user && typeof stored.user.id === 'string' && typeof stored.user.givenName === 'string' && typeof stored.user.familyName === 'string' && typeof stored.user.email === 'string' && ['partial','full','admin'].includes(stored.user.account) ? stored.user : null
 } catch { return null }
}
export function clearSessionUser() { try { localStorage.removeItem(PROFILE_KEY) } catch { /* Stockage désactivé. */ } }
export async function accountRequest(action: string, body?: unknown): Promise<Record<string, unknown>> {
 const base = import.meta.env.VITE_FICHES_API_URL?.trim().replace(/\/+$/, '')
 if (!base) throw Error('La gestion des comptes n’est pas encore configurée sur ce site.')
 let response: Response
 try { response = await fetch(`${base}/auth/${action}`, { method: 'POST', signal: AbortSignal.timeout(20000), headers: { 'Content-Type': 'application/json', ...(action === 'logout' && readAccessPassword() ? { Authorization: `Bearer ${readAccessPassword()}` } : {}) }, body: JSON.stringify(body ?? {}) }) }
 catch { throw Error('La connexion au serveur est indisponible. Réessayez plus tard.') }
 if (response.status === 404) throw Error('Les comptes personnels doivent encore être activés sur le serveur.')
 const data = await response.json().catch(() => ({}))
 if (!response.ok) throw Error(typeof data.error === 'string' ? data.error : 'La demande n’a pas abouti.')
 return data
}
export async function loginPersonal(email: string, password: string): Promise<SessionUser> {
 const data = await accountRequest('login', { email, password })
 if (typeof data.token !== 'string' || !data.token.startsWith('cfu_') || typeof data.expiresAt !== 'number') throw Error('La session reçue est invalide.')
 const user = data.user as SessionUser
 if (!user?.id || !user.givenName || !user.familyName || !['partial','full','admin'].includes(user.account)) throw Error('Le profil reçu est invalide.')
 rememberAccessPassword(data.token)
 localStorage.setItem(PROFILE_KEY, JSON.stringify({ user, expiresAt: data.expiresAt }))
 rememberFicheAuthor(`${user.givenName} ${user.familyName}`)
 return user
}
export function logoutPersonal() {
 if (readAccessPassword()?.startsWith('cfu_')) void accountRequest('logout').catch(() => undefined)
 clearSessionUser(); clearAccessPassword()
}
