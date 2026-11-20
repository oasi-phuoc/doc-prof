import { Resend } from 'resend'
export interface AccountsDB {
 prepare(sql: string): { bind(...values: unknown[]): ReturnType<AccountsDB['prepare']>; run(): Promise<unknown>; first<T>(): Promise<T | null> }
}
export interface AccountsEnv {
 DB: AccountsDB; RESEND_API_KEY?: string; RESEND_FROM?: string; RESEND_VERIFY_TEMPLATE_ID?: string; APP_ORIGIN?: string
}
export type PersonalUser = { id: string; givenName: string; familyName: string; email: string; account: 'partial' | 'full' | 'admin'; domains: string[] }
type UserRow = { domains: string; id: string; given_name: string; family_name: string; email: string; account: PersonalUser['account']; password_hash: string; password_salt: string; verified_at: string | null; failed_logins: number; locked_until: number }
const encoder = new TextEncoder()
const hex = (bytes: ArrayBuffer | Uint8Array) => Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, '0')).join('')
const random = () => hex(crypto.getRandomValues(new Uint8Array(32)))
export const hashToken = async (token: string) => hex(await crypto.subtle.digest('SHA-256', encoder.encode(token)))
async function passwordHash(password: string, salt: string) {
 const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits'])
 return hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', iterations: 100000, salt: encoder.encode(salt) }, key, 256))
}
const profile = (r: UserRow): PersonalUser => ({ id: r.id, givenName: r.given_name, familyName: r.family_name, email: r.email, account: r.account, domains: [...new Set(['algèbre','géométrie','alphabetisation', ...JSON.parse(r.domains)])] })
const validEmail = (s: string) => s.length <= 254 && /^[a-z0-9]+(?:[.!#$%&'*+/=?^_`{|}~-][a-z0-9]+)*@admin\.vs\.ch$/i.test(s)
const validPassword = (s: string) => s.length >= 8 && s.length <= 128 && /[A-Z]/.test(s) && /[a-z]/.test(s) && /[0-9]/.test(s) && /[^\p{L}\p{N}\s]/u.test(s)
const name = (v: unknown) => typeof v === 'string' ? v.trim().replace(/\s+/g, ' ') : ''
export async function personalUser(token: string, env: AccountsEnv): Promise<PersonalUser | null> {
 if (!/^cfu_[a-f0-9]{64}$/.test(token)) return null
 const row = await env.DB.prepare('SELECT u.* FROM users u JOIN user_sessions s ON s.user_id = u.id WHERE s.token_hash = ? AND s.expires_at > ? AND u.verified_at IS NOT NULL').bind(await hashToken(token), Date.now()).first<UserRow>()
 return row ? profile(row) : null
}
async function sendVerification(env: AccountsEnv, id: string, email: string): Promise<boolean> {
 const verification = random(), link = new URL('/acces', env.APP_ORIGIN || 'https://doc-prof.vercel.app')
 link.searchParams.set('verification', verification)
 await env.DB.prepare('DELETE FROM email_verifications WHERE user_id = ?').bind(id).run()
 await env.DB.prepare('INSERT INTO email_verifications (token_hash, user_id, expires_at) VALUES (?, ?, ?)').bind(await hashToken(verification), id, Date.now() + 24 * 3600000).run()
 const resend = new Resend(env.RESEND_API_KEY)
 for (let attempt = 0; attempt < 3; attempt++) {
  const result = await resend.emails.send({ from: env.RESEND_FROM!, to: [email], template: { id: env.RESEND_VERIFY_TEMPLATE_ID!, variables: { CONFIRMATION_URL: link.href } } }, { idempotencyKey: `verification/${await hashToken(verification)}` })
  if (!result.error) { console.info('Resend confirmation accepted', result.data.id); return true }
  const status = result.error.statusCode
  if (attempt === 2 || (status !== null && status !== 429 && status < 500)) return false
  const retry = Number(result.headers?.['retry-after'])
  if (retry > 5) return false // Ne pas bloquer une requête Worker trop longtemps.
  await new Promise(resolve => setTimeout(resolve, retry > 0 ? retry * 1000 : 250 * 2 ** attempt))
 }
 return false
}
export async function handleAccounts(request: Request, env: AccountsEnv, reply: (status: number, body: unknown) => Response): Promise<Response> {
 const action = new URL(request.url).pathname.split('/')[2]
 const token = request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '') ?? ''
 if (action === 'me' && request.method === 'GET') { const user = await personalUser(token, env); return user ? reply(200, { user }) : reply(401, { error: 'Votre session a expiré. Reconnectez-vous.' }) }
 if (action === 'logout' && request.method === 'POST') { if (/^cfu_[a-f0-9]{64}$/.test(token)) await env.DB.prepare('DELETE FROM user_sessions WHERE token_hash = ?').bind(await hashToken(token)).run(); return reply(200, { ok: true }) }
 if (request.method !== 'POST' || !['register','verify','login','resend'].includes(action ?? '')) return reply(404, { error: 'Adresse inconnue.' })
 const raw = await request.text()
 if (raw.length > 4096) return reply(413, { error: 'Le formulaire est trop volumineux.' })
 let body: Record<string, unknown>
 try { body = JSON.parse(raw); if (!body || typeof body !== 'object' || Array.isArray(body)) throw Error() } catch { return reply(400, { error: 'Le formulaire est illisible.' }) }
 if (action === 'verify') {
  if (typeof body.token !== 'string' || !/^[a-f0-9]{64}$/.test(body.token)) return reply(400, { error: 'Ce lien de confirmation est invalide.' })
  const hashed = await hashToken(body.token)
  const row = await env.DB.prepare('SELECT user_id FROM email_verifications WHERE token_hash = ? AND expires_at > ?').bind(hashed, Date.now()).first<{ user_id: string }>()
  if (!row) return reply(400, { error: 'Ce lien est expiré ou a déjà été utilisé.' })
  await env.DB.prepare('UPDATE users SET verified_at = ? WHERE id = ?').bind(new Date().toISOString(), row.user_id).run()
  await env.DB.prepare('DELETE FROM email_verifications WHERE user_id = ?').bind(row.user_id).run()
  return reply(200, { message: 'Votre adresse est confirmée. Vous pouvez vous connecter.' })
 }
 const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
 const password = typeof body.password === 'string' ? body.password : ''
 if (!validEmail(email)) return reply(400, { error: 'Utilisez votre adresse professionnelle @admin.vs.ch.' })
 if (action === 'register') {
  const given = name(body.givenName), family = name(body.familyName)
  if (!given || !family || given.length > 60 || family.length > 60) return reply(400, { error: 'Saisissez votre prénom et votre nom (60 caractères maximum chacun).' })
  if (!validPassword(password)) return reply(400, { error: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.' })
  if (!env.RESEND_API_KEY || !env.RESEND_FROM || !env.RESEND_VERIFY_TEMPLATE_ID) return reply(503, { error: 'La création des comptes sera disponible dès que l’envoi des e-mails de confirmation sera configuré.' })
  if (/@resend\.dev>?$/i.test(env.RESEND_FROM)) return reply(503, { error: 'Un domaine d’expédition validé est nécessaire pour confirmer les adresses @admin.vs.ch. L’expéditeur de test Resend ne permet pas l’inscription générale.' })
  const existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first<{ id: string }>()
  if (existing) return reply(409, { error: 'Cette adresse possède déjà un compte. Consultez votre e-mail de confirmation ou connectez-vous.' })
  const id = crypto.randomUUID(), salt = random()
  const hash = await passwordHash(password, salt), now = new Date().toISOString()
  await env.DB.prepare('INSERT INTO users (id, given_name, family_name, email, password_hash, password_salt, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(id, given, family, email, hash, salt, now).run()
  const sent = await sendVerification(env, id, email)
  if (!sent) { await env.DB.prepare('DELETE FROM email_verifications WHERE user_id = ?').bind(id).run(); await env.DB.prepare('DELETE FROM users WHERE id = ? AND verified_at IS NULL').bind(id).run(); return reply(503, { error: 'L’e-mail n’a pas pu être envoyé. Réessayez plus tard.' }) }
  return reply(201, { message: 'Consultez votre messagerie @admin.vs.ch et cliquez sur le lien pour activer votre compte.' })
 }
 if (!password || password.length > 128) return reply(401, { error: 'Adresse ou mot de passe incorrect.' })
 const row = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first<UserRow>()
 if (row && row.locked_until > Date.now()) return reply(429, { error: 'Trop de tentatives. Réessayez dans quinze minutes.' })
 // Même travail cryptographique pour une adresse inconnue.
 const hashed = await passwordHash(password, row?.password_salt ?? 'clairfle-unregistered-address')
 if (!row || !crypto.subtle.timingSafeEqual(encoder.encode(hashed), encoder.encode(row.password_hash))) {
  if (row) await env.DB.prepare('UPDATE users SET failed_logins = failed_logins + 1, locked_until = ? WHERE id = ?').bind(row.failed_logins >= 4 ? Date.now() + 15 * 60000 : 0, row.id).run()
  return reply(401, { error: 'Adresse ou mot de passe incorrect.' })
 }
 if (action === 'resend') {
  if (row.verified_at) return reply(200, { message: 'Votre adresse est déjà confirmée. Connectez-vous.' })
  if (!env.RESEND_API_KEY || !env.RESEND_FROM || !env.RESEND_VERIFY_TEMPLATE_ID) return reply(503, { error: 'L’envoi des e-mails n’est pas encore configuré.' })
  const last = await env.DB.prepare('SELECT expires_at FROM email_verifications WHERE user_id = ?').bind(row.id).first<{ expires_at: number }>()
  if (last && last.expires_at - 24 * 3600000 > Date.now() - 60000) return reply(429, { error: 'Un e-mail vient d’être envoyé. Patientez une minute avant de réessayer.' })
  const sent = await sendVerification(env, row.id, email)
  return sent ? reply(200, { message: 'Un nouveau lien de confirmation vous a été envoyé.' }) : reply(503, { error: 'L’e-mail n’a pas pu être envoyé. Réessayez plus tard.' })
 }
 if (!row.verified_at) return reply(403, { error: 'Confirmez votre adresse avec le lien reçu par e-mail avant de vous connecter.' })
 await env.DB.prepare('UPDATE users SET failed_logins = 0, locked_until = 0 WHERE id = ?').bind(row.id).run()
 const session = 'cfu_' + random(), expiresAt = Date.now() + 7 * 24 * 3600000
 await env.DB.prepare('DELETE FROM user_sessions WHERE expires_at <= ?').bind(Date.now()).run()
 await env.DB.prepare('INSERT INTO user_sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)').bind(await hashToken(session), row.id, expiresAt).run()
 return reply(200, { token: session, user: profile(row), expiresAt })
}
