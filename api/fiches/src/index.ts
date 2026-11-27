import { validLibreMetadata } from '../../../src/fiches/libre-metadata'
import { validLogistiqueCataloguePages } from '../../../src/logistique/catalog'
import { createPersonalAccount, handleAccounts, personalUser, type AccountsEnv } from './accounts'
import { handleCompetitionRequest, type CompetitionEnv } from './competition'
export { ClassroomCompetitionRoom } from './competition'

interface D1Prepared {
  bind(...values: unknown[]): D1Prepared
  run(): Promise<unknown>
  all<T>(): Promise<{ results?: T[] }>
  first<T>(): Promise<T | null>
}

interface D1Database {
  prepare(query: string): D1Prepared
}

interface Env extends CompetitionEnv, AccountsEnv {
  DB: D1Database
  ACCESS_ADMIN?: string
  ACCESS_FULL?: string
  ACCESS_PARTIAL?: string
  ACCESS_DOMAINS_ADMIN?: string
  ACCESS_DOMAINS_FULL?: string
  ACCESS_DOMAINS_PARTIAL?: string
}

type Account = 'admin' | 'full' | 'partial'

const FULL_TEST_DOMAINS = ['tcf-csc', 'tcf-cfr', 'tcm-csc', 'tcm-cfr'] as const

const ADMIN_ONLY = new Set([
  'tpf',
  'tcf-csc',
  'tcf-cfr',
  'tcf',
  'tcm-csc',
  'tcm-cfr',
  'tpm',
  'tcm',
])

function migrateTpmToken(value: string): string {
  if (value === 'tpm-csc' || value.startsWith('tpm-csc-') || value.startsWith('tpm-csc_')) {
    return `tcm${value.slice(3)}`
  }
  if (value === 'tpm-cfr' || value.startsWith('tpm-cfr-') || value.startsWith('tpm-cfr_')) {
    return `tcm${value.slice(3)}`
  }
  if (value === 'tcm_csc') return 'tcm-csc'
  if (value === 'tcm_cfr') return 'tcm-cfr'
  if (
    value === 'tcm-csc' ||
    value.startsWith('tcm-csc-') ||
    value.startsWith('tcm-csc_') ||
    value === 'tcm-cfr' ||
    value.startsWith('tcm-cfr-') ||
    value.startsWith('tcm-cfr_')
  ) {
    return value
  }
  if (value === 'tcm' || value.startsWith('tcm-') || value.startsWith('tcm_')) {
    return `tpm${value.slice(3)}`
  }
  return value
}

const ALL_DOMAINS = [
  'français',
  'algèbre',
  'géométrie',
  'alphabetisation',
  'soutien-fr',
  'gattegno',
  'jeux',
  'calligraphie',
  'grammaire',
  'logistique-cfc',
  'logistique-afp',
  'vocabulaire',
  'société',
  'santé',
  'acm',
  'tpm',
  'tcm-csc',
  'tcm-cfr',
  'tpf',
  'tcf-csc',
  'tcf-cfr',
] as const

const MAX_BODY = 800_000

function corsHeaders(request: Request): Headers {
  const headers = new Headers()
  headers.set('Access-Control-Allow-Origin', request.headers.get('Origin') ?? '*')
  headers.set('Vary', 'Origin')
  headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type')
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  headers.set('Access-Control-Max-Age', '86400')
  return headers
}

function json(request: Request, status: number, body: unknown): Response {
  const headers = corsHeaders(request)
  headers.set('Content-Type', 'application/json; charset=utf-8')
  return new Response(JSON.stringify(body), { status, headers })
}

function adminAccessConfigured(env: Env): boolean {
  return typeof env.ACCESS_ADMIN === 'string' && env.ACCESS_ADMIN.trim().length > 0
}

async function accountsHealth(request: Request, env: Env): Promise<Response> {
  const checkQuery = async (sql: string): Promise<boolean> => {
    if (!env.DB) return false
    try {
      await env.DB.prepare(sql).all()
      return true
    } catch {
      return false
    }
  }
  // LIMIT 0 vérifie les colonnes utilisées, sans lire de données personnelles.
  const [fichesReady, usersReady, sessionsReady] = await Promise.all([
    checkQuery('SELECT id, name, domains, recipe, created_at, updated_at, owner_id FROM fiches LIMIT 0'),
    checkQuery('SELECT id, given_name, family_name, email, password_hash, password_salt, domains, account, verified_at, created_at, failed_logins, locked_until FROM users LIMIT 0'),
    checkQuery('SELECT token_hash, user_id, expires_at FROM user_sessions LIMIT 0'),
  ])
  const checks = {
    adminAccessConfigured: adminAccessConfigured(env),
    databaseBound: Boolean(env.DB),
    fichesSchemaReady: fichesReady,
    accountsSchemaReady: usersReady && sessionsReady,
  }
  const ok = Object.values(checks).every(Boolean)
  const response = json(request, ok ? 200 : 503, { ok, service: 'clairfle-fiches', checks })
  response.headers.set('Cache-Control', 'no-store')
  return response
}

function safeEqual(a: string, b: string): boolean {
  const left = new TextEncoder().encode(a)
  const right = new TextEncoder().encode(b)
  if (left.byteLength !== right.byteLength) return false
  return crypto.subtle.timingSafeEqual(left, right)
}

function accountFromPassword(password: string, env: Env): Account | null {
  const pairs: Array<[string | undefined, Account]> = [
    [env.ACCESS_ADMIN, 'admin'],
    [env.ACCESS_FULL, 'full'],
    [env.ACCESS_PARTIAL, 'partial'],
  ]
  for (const [secret, account] of pairs) {
    if (!secret || !password) continue
    if (safeEqual(password, secret)) return account
  }
  return null
}

function bearer(request: Request): string {
  const header = request.headers.get('Authorization') ?? ''
  const match = /^Bearer\s+(\S.*)$/i.exec(header)
  return match?.[1]?.trim() ?? ''
}

function parseDomainCsv(raw: string | undefined): string[] {
  if (!raw?.trim()) return []
  const out: string[] = []
  const seen = new Set<string>()
  for (const part of raw.split(/[,;|]/)) {
    const token = migrateTpmToken(part.trim())
    const domain = token === 'tcf' ? 'tpf' : token
    if (!domain || seen.has(domain)) continue
    seen.add(domain)
    out.push(domain)
  }
  return out
}

function regularDomains(): string[] {
  return ALL_DOMAINS.filter((domain) => !ADMIN_ONLY.has(domain))
}

function partialDomains(env: Env): Set<string> {
  const domains = parseDomainCsv(env.ACCESS_DOMAINS_PARTIAL)
  return new Set(['algèbre', 'géométrie', 'alphabetisation', ...domains])
}

function allowedDomains(account: Account, env: Env): Set<string> {
  if (account === 'admin') {
    const fromEnv = parseDomainCsv(env.ACCESS_DOMAINS_ADMIN)
    return new Set(fromEnv.length > 0 ? [...ALL_DOMAINS, ...fromEnv] : ALL_DOMAINS)
  }
  if (account === 'full') {
    const fromEnv = parseDomainCsv(env.ACCESS_DOMAINS_FULL)
    return new Set([...(fromEnv.length > 0 ? fromEnv : regularDomains()), ...FULL_TEST_DOMAINS])
  }
  return partialDomains(env)
}

function canAccess(account: Account, domains: string[], env: Env): boolean {
  if (domains.length === 0) return false
  if (account === 'admin') {
    return domains.every((domain) => domain.length > 0 && domain.length < 40)
  }
  const allowed = allowedDomains(account, env)
  return domains.every((domain) => allowed.has(domain))
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isPage(value: unknown): value is Record<string, unknown> {
  return isRecord(value) && typeof value.domain === 'string' && typeof value.exerciseType === 'string'
}

function parseRecipe(value: unknown): Record<string, unknown> | null {
  if (!isRecord(value) || value.version !== 1) return null
  if (!Array.isArray(value.pages) || value.pages.length === 0 || value.pages.length > 60) return null
  if (!value.pages.every(isPage) || !validLogistiqueCataloguePages(value.pages) || !validLibreMetadata(value.pages)) return null
  if (typeof value.seed !== 'number' || !Number.isFinite(value.seed)) return null
  if (!isRecord(value.institutional)) return null
  if (typeof value.evalMode !== 'boolean') return null
  if (typeof value.pointsPerQuestion !== 'number' || !Number.isFinite(value.pointsPerQuestion)) return null
  if (value.pointsPerQuestion < 0 || value.pointsPerQuestion > 1000) return null
  if (typeof value.libreMode !== 'boolean') return null
  if (value.libreSnapshot !== null) {
    if (!Array.isArray(value.libreSnapshot) || value.libreSnapshot.length > 60) return null
    if (!value.libreSnapshot.every(isPage) || !validLogistiqueCataloguePages(value.libreSnapshot) || !validLibreMetadata(value.libreSnapshot)) return null
  }
  return value
}

function domainsOf(recipe: Record<string, unknown>): string[] {
  const pages = recipe.pages as Array<Record<string, unknown>>
  const domains: string[] = []
  for (const page of pages) {
    const domain = String(page.domain)
    if (!domains.includes(domain)) domains.push(domain)
  }
  return domains
}

function parseName(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const name = value.trim().replace(/\s+/g, ' ')
  if (name.length < 1 || name.length > 80) return null
  return name
}

type FicheRow = {
  id: string
  name: string
  domains: string
  recipe: string
  created_at: string
  updated_at: string
  owner_id: string | null
}

function toClient(row: FicheRow) {
  const domains = (JSON.parse(row.domains) as string[]).map(migrateTpmToken)
  return {
    id: row.id,
    name: row.name,
    domains,
    recipe: JSON.parse(row.recipe) as unknown,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

async function readBody(request: Request): Promise<{ name: string; recipe: Record<string, unknown> } | Response> {
  const text = await request.text()
  if (text.length > MAX_BODY) {
    return json(request, 413, { error: 'La fiche est trop volumineuse pour être synchronisée.' })
  }
  let body: unknown
  try {
    body = JSON.parse(text)
  } catch {
    return json(request, 400, { error: 'Le contenu envoyé est illisible.' })
  }
  if (!isRecord(body)) return json(request, 400, { error: 'Le contenu envoyé est illisible.' })
  const name = parseName(body.name)
  if (!name) return json(request, 400, { error: 'Donnez un nom à la fiche (80 caractères maximum).' })
  const recipe = parseRecipe(body.recipe)
  if (!recipe) return json(request, 400, { error: 'La configuration de la fiche est incomplète.' })
  return { name, recipe }
}

function isResponse(value: unknown): value is Response {
  return value instanceof Response
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (new URL(request.url).pathname.startsWith('/competition')) return handleCompetitionRequest(request, env)
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(request) })
    }

    const url = new URL(request.url)
    const parts = url.pathname.split('/').filter(Boolean)

    if (request.method === 'GET' && parts.length === 0) {
      return json(request, 200, { ok: true })
    }

    if (request.method === 'GET' && parts.length === 1 && parts[0] === 'health') {
      return accountsHealth(request, env)
    }

    if (parts[0] === 'auth') {
      try { return await handleAccounts(request, env, (status, body) => json(request, status, body)) }
      catch { return json(request, 503, { error: 'La gestion des comptes est indisponible. Réessayez plus tard.' }) }
    }

    if (!['fiches', 'users'].includes(parts[0]) || parts.length > 2) {
      return json(request, 404, { error: 'Adresse inconnue.' })
    }

    const token = bearer(request)
    let user: Awaited<ReturnType<typeof personalUser>> = null
    try { user = await personalUser(token, env) } catch { return json(request, 503, { error: 'La synchronisation est indisponible.' }) }
    const account = user?.account ?? accountFromPassword(token, env)
    if (!account) {
      if (parts[0] === 'users' && token && !token.startsWith('cfu_') && !adminAccessConfigured(env)) {
        return json(request, 503, { error: 'L’accès administrateur n’est pas configuré sur le serveur. Ajoutez ACCESS_ADMIN comme secret du Worker dans Variables and Secrets, en dehors de la section Builds.' })
      }
      return json(request, 401, { error: 'Mot de passe refusé.' })
    }

    try {
      if (parts[0] === 'users') {
        if (account !== 'admin') return json(request, 403, { error: 'Cet accès est réservé à l’administrateur.' })
        if (request.method === 'POST' && parts.length === 1) return await createPersonalAccount(request, env, ALL_DOMAINS, (status, body) => json(request, status, body))
        if (request.method === 'GET' && parts.length === 1) {
          const { results } = await env.DB.prepare('SELECT id, given_name, family_name, email, account, domains, verified_at FROM users ORDER BY family_name, given_name').all<{id:string;given_name:string;family_name:string;email:string;account:string;domains:string;verified_at:string|null}>()
          return json(request, 200, { users: (results ?? []).map(r => ({id:r.id,givenName:r.given_name,familyName:r.family_name,email:r.email,account:r.account,active:Boolean(r.verified_at),domains:JSON.parse(r.domains)})) })
        }
        if (request.method === 'PUT' && /^[0-9a-f-]{36}$/i.test(parts[1] ?? '')) {
          const raw = await request.text()
          if (raw.length > 4096) return json(request, 413, { error: 'La demande est trop volumineuse.' })
          let body: unknown; try { body=JSON.parse(raw) } catch { return json(request,400,{error:'La demande est illisible.'}) }
          if (!isRecord(body) || !Array.isArray(body.domains) || !body.domains.every(d => typeof d === 'string' && (ALL_DOMAINS as readonly string[]).includes(d))) return json(request,400,{error:'Choisissez des domaines du catalogue.'})
          const target = await env.DB.prepare('SELECT id FROM users WHERE id = ?').bind(parts[1]).first<{id:string}>()
          if (!target) return json(request,404,{error:'Ce compte n’existe plus.'})
          const domains = [...new Set(['algèbre','géométrie','alphabetisation', ...body.domains])]
          await env.DB.prepare('UPDATE users SET domains = ? WHERE id = ?').bind(JSON.stringify(domains),parts[1]).run()
          return json(request,200,{domains})
        }
        return json(request,405,{error:'Méthode refusée.'})
      }
      if (request.method === 'GET' && parts.length === 1) {
        const { results } = await env.DB.prepare(
          `SELECT id, name, domains, recipe, created_at, updated_at, owner_id FROM fiches ${user ? 'WHERE owner_id = ?' : account === 'admin' ? '' : 'WHERE owner_id IS NULL'} ORDER BY updated_at DESC`,
        ).bind(...(user ? [user.id] : [])).all<FicheRow>()
        const fiches = (results ?? [])
          .map(toClient)
          .filter((fiche) => (user ? fiche.domains.every(d => user.domains.includes(d)) : canAccess(account, fiche.domains, env)))
        return json(request, 200, { fiches })
      }

      if (request.method === 'POST' && parts.length === 1) {
        const parsed = await readBody(request)
        if (isResponse(parsed)) return parsed
        if (user) parsed.recipe.savedBy = `${user.givenName} ${user.familyName}`
        const domains = domainsOf(parsed.recipe)
        if (!(user ? domains.every(d => user.domains.includes(d)) : canAccess(account, domains, env))) {
          return json(request, 403, { error: 'Ce compte ne peut pas enregistrer cette fiche.' })
        }
        const id = crypto.randomUUID()
        const now = new Date().toISOString()
        await env.DB.prepare(
          'INSERT INTO fiches (id, name, domains, recipe, created_at, updated_at, owner_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        )
          .bind(id, parsed.name, JSON.stringify(domains), JSON.stringify(parsed.recipe), now, now, user?.id ?? null)
          .run()
        return json(request, 201, {
          fiche: {
            id,
            name: parsed.name,
            domains,
            recipe: parsed.recipe,
            createdAt: now,
            updatedAt: now,
          },
        })
      }

      const id = parts[1] ?? ''
      if (!/^[0-9a-f-]{36}$/i.test(id)) {
        return json(request, 400, { error: 'Identifiant de fiche invalide.' })
      }

      const existing = await env.DB.prepare(
        'SELECT id, name, domains, recipe, created_at, updated_at, owner_id FROM fiches WHERE id = ?',
      )
        .bind(id)
        .first<FicheRow>()

      if (existing && (user ? existing.owner_id !== user.id : account !== 'admin' && existing.owner_id !== null)) return json(request, 404, { error: 'Cette fiche n’existe plus.' })
      if (!existing) return json(request, 404, { error: 'Cette fiche n’existe plus.' })
      const existingDomains = JSON.parse(existing.domains) as string[]
      if (!(user ? existingDomains.every(d => user.domains.includes(d)) : canAccess(account, existingDomains, env))) {
        return json(request, 403, { error: 'Ce compte ne peut pas modifier cette fiche.' })
      }

      if (request.method === 'DELETE') {
        await env.DB.prepare('DELETE FROM fiches WHERE id = ?').bind(id).run()
        return json(request, 200, { ok: true })
      }

      if (request.method === 'PUT') {
        const parsed = await readBody(request)
        if (isResponse(parsed)) return parsed
        if (user) parsed.recipe.savedBy = `${user.givenName} ${user.familyName}`
        const domains = domainsOf(parsed.recipe)
        if (!(user ? domains.every(d => user.domains.includes(d)) : canAccess(account, domains, env))) {
          return json(request, 403, { error: 'Ce compte ne peut pas enregistrer cette fiche.' })
        }
        const now = new Date().toISOString()
        await env.DB.prepare(
          'UPDATE fiches SET name = ?, domains = ?, recipe = ?, updated_at = ? WHERE id = ?',
        )
          .bind(parsed.name, JSON.stringify(domains), JSON.stringify(parsed.recipe), now, id)
          .run()
        return json(request, 200, {
          fiche: {
            id,
            name: parsed.name,
            domains,
            recipe: parsed.recipe,
            createdAt: existing.created_at,
            updatedAt: now,
          },
        })
      }

      return json(request, 405, { error: 'Méthode refusée.' })
    } catch (error) {
      console.error(error)
      return json(request, 500, { error: 'La synchronisation a échoué. Réessayez.' })
    }
  },
}
