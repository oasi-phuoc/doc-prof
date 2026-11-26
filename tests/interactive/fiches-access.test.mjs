import assert from 'node:assert/strict'
import { resolve } from 'node:path'
import { timingSafeEqual } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { DatabaseSync } from 'node:sqlite'
import test from 'node:test'
import { createServer } from 'vite'

const tests = ['tcf-csc', 'tcf-cfr', 'tcm-csc', 'tcm-cfr']
const template = JSON.parse(await readFile('docs/interactive/demo-source-recipe.json', 'utf8'))
const schema = (await readFile('api/fiches/migrations/0001_fiches.sql', 'utf8')) + (await readFile('api/fiches/migrations/0002_personal_accounts.sql', 'utf8') + await readFile('api/fiches/migrations/0003_admin_accounts.sql', 'utf8'))
const originalTimingSafeEqual = Object.getOwnPropertyDescriptor(crypto.subtle, 'timingSafeEqual')
Object.defineProperty(crypto.subtle, 'timingSafeEqual', { value: timingSafeEqual, configurable: true })
const vite = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })

async function clientAccess(domains) {
  const server = await createServer({ configFile: false, resolve: { alias: { '@': resolve('src') } }, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom', define: {
    'import.meta.env.VITE_ACCESS_DOMAINS_FULL': domains === undefined ? 'undefined' : JSON.stringify(domains),
  } })
  try { return await server.ssrLoadModule('/src/access.ts') } finally { await server.close() }
}

try {
  const worker = (await vite.ssrLoadModule('/api/fiches/src/index.ts')).default
  function harness(fullDomains) {
    const db = new DatabaseSync(':memory:')
    db.exec(schema)
    const env = { ACCESS_ADMIN: 'admin-fixture', ACCESS_FULL: 'full-fixture', ACCESS_PARTIAL: 'partial-fixture', ACCESS_DOMAINS_FULL: fullDomains, DB: {
      prepare(sql) {
        let values = []
        const statement = db.prepare(sql)
        return {
          bind(...args) { values = args; return this },
          async all() { return { results: statement.all(...values) } },
          async first() { return statement.get(...values) ?? null },
          async run() { return statement.run(...values) },
        }
      },
    } }
    return { close: () => db.close(), async request(method, path = '/fiches', body, role = 'full') {
      const headers = { 'Content-Type': 'application/json', ...(role ? { Authorization: `Bearer ${role}-fixture` } : {}) }
      const response = await worker.fetch(new Request(`https://fiches.example${path}`, { method, headers, ...(body ? { body: JSON.stringify(body) } : {}) }), env)
      return { status: response.status, body: await response.json() }
    } }
  }
  const data = (...domains) => ({ name: 'Fiche de vérification', recipe: { ...template, libreMode: false, libreSnapshot: null, pages: domains.map(domain => ({ ...template.pages[0], domain })) } })

  await test('full client access includes all four TCF/TCM tests without a domain environment variable', async () => {
    const { domainsForAccount, accountCanAccessDomain } = await clientAccess()
    const allowed = domainsForAccount('full')
    for (const domain of ['algèbre', 'grammaire', ...tests]) assert(allowed.includes(domain), domain)
    assert.equal(new Set(allowed).size, allowed.length)
    assert.equal(accountCanAccessDomain(null, 'tcf-csc'), false)
    assert.equal(accountCanAccessDomain('partial', 'tcf-csc'), false)
    assert.deepEqual(new Set(domainsForAccount('partial')), new Set(['algèbre','géométrie','alphabetisation']))
  })

  await test('a configured full domain list also includes logistics and the four TCF/TCM tests', async () => {
    const { domainsForAccount } = await clientAccess('algèbre,tcm-csc')
    assert.deepEqual(new Set(domainsForAccount('full')), new Set(['algèbre', 'logistique-cfc', 'logistique-afp', ...tests]))
    assert(!domainsForAccount('full').includes('tpf'))
    assert(!domainsForAccount('full').includes('tpm'))
    assert(domainsForAccount('admin').includes('tpf'))
  })

  for (const configured of [undefined, 'algèbre']) {
    await test(`full can save, list and update all four tests with ${configured ? 'an old' : 'no'} server domain configuration`, async () => {
      const h = harness(configured)
      try {
        for (const domain of tests) {
          const created = await h.request('POST', '/fiches', data(domain))
          assert.equal(created.status, 201, domain)
          const changed = await h.request('PUT', `/fiches/${created.body.fiche.id}`, { ...data(domain), name: `Fiche ${domain} mise à jour` })
          assert.equal(changed.status, 200)
          assert.equal(changed.body.fiche.name, `Fiche ${domain} mise à jour`)
        }
        const list = await h.request('GET')
        assert.equal(list.status, 200)
        assert.deepEqual(new Set(list.body.fiches.flatMap(f => f.domains)), new Set(tests))
      } finally { h.close() }
    })
  }

  await test('saving regular and mixed permitted worksheets remains possible for full', async () => {
    const h = harness('algèbre')
    try {
      assert.equal((await h.request('POST', '/fiches', data('algèbre'))).status, 201)
      assert.equal((await h.request('POST', '/fiches', data('algèbre', ...tests))).status, 201)
      assert.equal((await h.request('POST', '/fiches', data('grammaire'))).status, 403)
    } finally { h.close() }
  })

  await test('partial access and unauthenticated requests cannot save or list the TCF/TCM worksheets', async () => {
    const h = harness()
    try {
      for (const domain of tests) {
        assert.equal((await h.request('POST', '/fiches', data(domain), 'admin')).status, 201)
        assert.equal((await h.request('POST', '/fiches', data(domain), 'partial')).status, 403)
      }
      assert.deepEqual((await h.request('GET', '/fiches', undefined, 'partial')).body.fiches, [])
      assert.equal((await h.request('GET', '/fiches', undefined, null)).status, 401)
      assert.equal((await h.request('POST', '/fiches', data('tcf-csc'), null)).status, 401)
      assert.equal((await h.request('POST', '/fiches', data('algèbre'), 'partial')).status, 201)
      assert.equal((await h.request('POST', '/fiches', data('alphabetisation'), 'partial')).status, 201)
    } finally { h.close() }
  })

  await test('full cannot use a mixed worksheet to gain a domain outside its permissions', async () => {
    const h = harness('algèbre')
    try {
      const restricted = await h.request('POST', '/fiches', data('tcf-csc', 'tpf'), 'admin')
      assert.equal(restricted.status, 201)
      assert.deepEqual((await h.request('GET')).body.fiches, [])
      assert.equal((await h.request('POST', '/fiches', data('tcf-csc', 'tpf'))).status, 403)
      assert.equal((await h.request('PUT', `/fiches/${restricted.body.fiche.id}`, data('tcf-csc'))).status, 403)
    } finally { h.close() }
  })
} finally {
  await vite.close()
  if (originalTimingSafeEqual) Object.defineProperty(crypto.subtle, 'timingSafeEqual', originalTimingSafeEqual)
  else delete crypto.subtle.timingSafeEqual
}
