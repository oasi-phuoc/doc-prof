import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { timingSafeEqual } from 'node:crypto'
import { DatabaseSync } from 'node:sqlite'
import test from 'node:test'
import { createServer } from 'vite'

const migrations = await Promise.all(['0001_fiches.sql', '0002_personal_accounts.sql', '0003_admin_accounts.sql']
  .map(name => readFile(`api/fiches/migrations/${name}`, 'utf8')))
const descriptor = Object.getOwnPropertyDescriptor(crypto.subtle, 'timingSafeEqual')
Object.defineProperty(crypto.subtle, 'timingSafeEqual', { value: timingSafeEqual, configurable: true })
const vite = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
try {
  const worker = (await vite.ssrLoadModule('/api/fiches/src/index.ts')).default
  function harness({ secret = 'fixture-admin', schema = migrations.join(''), missingBinding = false } = {}) {
    const db = new DatabaseSync(':memory:')
    db.exec(schema)
    const env = { ACCESS_ADMIN: secret, DB: missingBinding ? undefined : {
      prepare(sql) {
        const statement = db.prepare(sql)
        let values = []
        return {
          bind(...args) { values = args; return this },
          async all() { return { results: statement.all(...values) } },
          async first() { return statement.get(...values) ?? null },
          async run() { return statement.run(...values) },
        }
      },
    } }
    return { db, env, close: () => db.close(), async request(path = '/health', token) {
      const response = await worker.fetch(new Request(`https://api.example.test${path}`, {
        headers: { Origin: 'https://doc-prof.vercel.app', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      }), env)
      return { response, body: await response.json() }
    } }
  }

  await test('health vérifie les schémas sans retourner les secrets ni lire les lignes', async () => {
    const h = harness()
    try {
      const sql = []
      const prepare = h.env.DB.prepare.bind(h.env.DB)
      h.env.DB.prepare = query => { sql.push(query); return prepare(query) }
      const { response, body } = await h.request()
      assert.equal(response.status, 200)
      assert.equal(response.headers.get('Cache-Control'), 'no-store')
      assert.equal(response.headers.get('Access-Control-Allow-Origin'), 'https://doc-prof.vercel.app')
      assert.deepEqual(body, { ok: true, service: 'clairfle-fiches', checks: {
        adminAccessConfigured: true, databaseBound: true, fichesSchemaReady: true, accountsSchemaReady: true,
      } })
      assert.equal(sql.length, 3)
      assert(sql.every(query => /^SELECT .+ LIMIT 0$/.test(query)))
      assert(!JSON.stringify(body).includes('fixture-admin'))
      assert.equal(h.db.prepare('SELECT COUNT(*) AS n FROM users').get().n, 0)
    } finally { h.close() }
  })

  await test('health distingue un secret administrateur absent ou vide', async () => {
    for (const secret of [null, '', '   ']) {
      const h = harness({ secret })
      try {
        const { response, body } = await h.request()
        assert.equal(response.status, 503)
        assert.equal(body.checks.adminAccessConfigured, false)
        assert.equal(body.checks.accountsSchemaReady, true)
      } finally { h.close() }
    }
  })

  await test('health distingue une liaison D1 absente', async () => {
    const h = harness({ missingBinding: true })
    try {
      const { response, body } = await h.request()
      assert.equal(response.status, 503)
      assert.deepEqual(body.checks, { adminAccessConfigured: true, databaseBound: false, fichesSchemaReady: false, accountsSchemaReady: false })
    } finally { h.close() }
  })

  await test('health détecte la migration des comptes manquante et préserve les fiches existantes', async () => {
    const h = harness({ schema: migrations[0] })
    try {
      h.db.prepare('INSERT INTO fiches VALUES (?, ?, ?, ?, ?, ?)').run('historique', 'Fiche historique', '[]', '{}', '2026-11-23', '2026-11-23')
      const { response, body } = await h.request()
      assert.equal(response.status, 503)
      assert.equal(body.checks.databaseBound, true)
      assert.equal(body.checks.fichesSchemaReady, false)
      assert.equal(body.checks.accountsSchemaReady, false)
      assert.equal(h.db.prepare('SELECT name FROM fiches WHERE id = ?').get('historique').name, 'Fiche historique')
    } finally { h.close() }
  })

  await test('health contrôle aussi le stockage des sessions et masque les erreurs D1', async () => {
    const h = harness()
    try {
      h.db.exec('DROP TABLE user_sessions')
      let result = await h.request()
      assert.equal(result.response.status, 503)
      assert.equal(result.body.checks.fichesSchemaReady, true)
      assert.equal(result.body.checks.accountsSchemaReady, false)
      h.env.DB.prepare = () => { throw Error('Détail interne à ne pas exposer') }
      result = await h.request()
      assert.equal(result.response.status, 503)
      assert(!JSON.stringify(result.body).includes('Détail interne'))
    } finally { h.close() }
  })

  await test('sans secret serveur, la page des comptes reçoit une erreur de configuration distincte', async () => {
    const h = harness({ secret: null })
    try {
      const { response, body } = await h.request('/users', 'fixture-submitted')
      assert.equal(response.status, 503)
      assert(body.error.includes('ACCESS_ADMIN'))
      assert(body.error.includes('en dehors de la section Builds'))
      assert(!JSON.stringify(body).includes('fixture-submitted'))
      assert.equal((await h.request('/users')).response.status, 401)
    } finally { h.close() }
  })

  await test('un secret configuré ne permet pas de contourner un mot de passe incorrect', async () => {
    const h = harness()
    try {
      assert.equal((await h.request('/users', 'fixture-wrong')).response.status, 401)
      const good = await h.request('/users', 'fixture-admin')
      assert.equal(good.response.status, 200)
      assert.deepEqual(good.body, { users: [] })
      assert.deepEqual((await h.request('/')).body, { ok: true })
      assert.equal((await h.request('/health/extra')).response.status, 404)
    } finally { h.close() }
  })
} finally {
  await vite.close()
  if (descriptor) Object.defineProperty(crypto.subtle, 'timingSafeEqual', descriptor)
  else delete crypto.subtle.timingSafeEqual
}
