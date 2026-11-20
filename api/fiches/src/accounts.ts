export interface AccountsDB {
 prepare(sql: string): { bind(...values: unknown[]): ReturnType<AccountsDB['prepare']>; run(): Promise<unknown>; first<T>(): Promise<T | null> }
}
export interface AccountsEnv { DB: AccountsDB }
export const MINIMUM_DOMAINS = ['algèbre', 'géométrie', 'alphabetisation']
export type PersonalUser = { id: string; givenName: string; familyName: string; email: string; account: 'partial' | 'full' | 'admin'; domains: string[] }
type UserRow = { domains: string; id: string; given_name: string; family_name: string; email: string; account: PersonalUser['account']; password_hash: string; password_salt: string; verified_at: string | null; failed_logins: number; locked_until: number }
type Reply = (status: number, body: unknown) => Response
const encoder = new TextEncoder()
const hex = (bytes: ArrayBuffer | Uint8Array) => Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, '0')).join('')
const random = () => hex(crypto.getRandomValues(new Uint8Array(32)))
export const hashToken = async (token: string) => hex(await crypto.subtle.digest('SHA-256', encoder.encode(token)))
async function passwordHash(password: string, salt: string) {
 const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits'])
 return hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', iterations: 100000, salt: encoder.encode(salt) }, key, 256))
}
const profile = (r: UserRow): PersonalUser => ({ id: r.id, givenName: r.given_name, familyName: r.family_name, email: r.email, account: r.account, domains: [...new Set([...MINIMUM_DOMAINS, ...JSON.parse(r.domains)])] })
const validEmail = (s: string) => s.length <= 254 && /^[a-z0-9]+(?:[.!#$%&'*+/=?^_`{|}~-][a-z0-9]+)*@admin\.vs\.ch$/i.test(s)
const validPassword = (s: string) => s.length >= 8 && s.length <= 128 && /[A-Z]/.test(s) && /[a-z]/.test(s) && /[0-9]/.test(s) && /[^\p{L}\p{N}\s]/u.test(s)
const name = (v: unknown) => typeof v === 'string' ? v.trim().replace(/\s+/g, ' ') : ''
async function formBody(request: Request, reply: Reply): Promise<Record<string, unknown> | Response> {
 const raw = await request.text()
 if (raw.length > 4096) return reply(413, { error: 'Le formulaire est trop volumineux.' })
 try { const body = JSON.parse(raw); if (!body || typeof body !== 'object' || Array.isArray(body)) throw Error(); return body }
 catch { return reply(400, { error: 'Le formulaire est illisible.' }) }
}
export async function personalUser(token: string, env: AccountsEnv): Promise<PersonalUser | null> {
 if (!/^cfu_[a-f0-9]{64}$/.test(token)) return null
 const row = await env.DB.prepare('SELECT u.* FROM users u JOIN user_sessions s ON s.user_id = u.id WHERE s.token_hash = ? AND s.expires_at > ? AND u.verified_at IS NOT NULL').bind(await hashToken(token), Date.now()).first<UserRow>()
 return row ? profile(row) : null
}
/** Appelée uniquement après le contrôle du rôle administrateur dans le routeur. */
export async function createPersonalAccount(request: Request, env: AccountsEnv, allowedDomains: readonly string[], reply: Reply): Promise<Response> {
 const body = await formBody(request, reply)
 if (body instanceof Response) return body
 const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
 const password = typeof body.password === 'string' ? body.password : ''
 const given = name(body.givenName), family = name(body.familyName)
 if (!validEmail(email)) return reply(400, { error: 'Utilisez une adresse professionnelle @admin.vs.ch.' })
 if (!given || !family || given.length > 60 || family.length > 60) return reply(400, { error: 'Saisissez le prénom et le nom (60 caractères maximum chacun).' })
 if (!validPassword(password)) return reply(400, { error: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.' })
 if (body.domains !== undefined && (!Array.isArray(body.domains) || !body.domains.every(d => typeof d === 'string' && allowedDomains.includes(d)))) return reply(400, { error: 'Choisissez des domaines du catalogue.' })
 const domains = [...new Set([...MINIMUM_DOMAINS, ...(body.domains as string[] | undefined ?? [])])]
 const id = crypto.randomUUID(), salt = random(), now = new Date().toISOString()
 // verified_at conserve le schéma historique : il signifie désormais « activé par l’administrateur ».
 const row = await env.DB.prepare("INSERT INTO users (id, given_name, family_name, email, password_hash, password_salt, domains, account, verified_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'partial', ?, ?) ON CONFLICT(email) DO NOTHING RETURNING *").bind(id, given, family, email, await passwordHash(password, salt), salt, JSON.stringify(domains), now, now).first<UserRow>()
 if (!row) return reply(409, { error: 'Cette adresse possède déjà un compte.' })
 return reply(201, { user: { ...profile(row), active: true }, message: 'Compte créé. La personne peut se connecter avec l’adresse et le mot de passe que vous lui communiquez.' })
}
export async function handleAccounts(request: Request, env: AccountsEnv, reply: Reply): Promise<Response> {
 const parts = new URL(request.url).pathname.split('/').filter(Boolean)
 if (parts.length !== 2) return reply(404, { error: 'Adresse inconnue.' })
 const action = parts[1]
 const token = request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '') ?? ''
 if (action === 'me' && request.method === 'GET') { const user = await personalUser(token, env); return user ? reply(200, { user }) : reply(401, { error: 'Votre session a expiré. Reconnectez-vous.' }) }
 if (action === 'logout' && request.method === 'POST') { if (/^cfu_[a-f0-9]{64}$/.test(token)) await env.DB.prepare('DELETE FROM user_sessions WHERE token_hash = ?').bind(await hashToken(token)).run(); return reply(200, { ok: true }) }
 if (request.method !== 'POST' || action !== 'login') return reply(404, { error: 'Adresse inconnue.' })
 const body = await formBody(request, reply)
 if (body instanceof Response) return body
 const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
 const password = typeof body.password === 'string' ? body.password : ''
 if (!validEmail(email)) return reply(400, { error: 'Utilisez votre adresse professionnelle @admin.vs.ch.' })
 if (!password || password.length > 128) return reply(401, { error: 'Adresse ou mot de passe incorrect.' })
 const row = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first<UserRow>()
 if (row && row.locked_until > Date.now()) return reply(429, { error: 'Trop de tentatives. Réessayez dans quinze minutes.' })
 const hashed = await passwordHash(password, row?.password_salt ?? 'clairfle-unregistered-address')
 if (!row || !crypto.subtle.timingSafeEqual(encoder.encode(hashed), encoder.encode(row.password_hash))) {
  if (row) await env.DB.prepare('UPDATE users SET failed_logins = failed_logins + 1, locked_until = ? WHERE id = ?').bind(row.failed_logins >= 4 ? Date.now() + 15 * 60000 : 0, row.id).run()
  return reply(401, { error: 'Adresse ou mot de passe incorrect.' })
 }
 if (!row.verified_at) return reply(403, { error: 'Ce compte n’est pas actif. Contactez l’administrateur.' })
 await env.DB.prepare('UPDATE users SET failed_logins = 0, locked_until = 0 WHERE id = ?').bind(row.id).run()
 const session = 'cfu_' + random(), expiresAt = Date.now() + 7 * 24 * 3600000
 await env.DB.prepare('DELETE FROM user_sessions WHERE expires_at <= ?').bind(Date.now()).run()
 await env.DB.prepare('INSERT INTO user_sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)').bind(await hashToken(session), row.id, expiresAt).run()
 return reply(200, { token: session, user: profile(row), expiresAt })
}
