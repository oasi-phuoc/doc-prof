import assert from 'node:assert/strict'
import { resolve } from 'node:path'
import { timingSafeEqual } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { DatabaseSync } from 'node:sqlite'
import test from 'node:test'
import { createServer } from 'vite'

const tests = ['tcf-csc', 'tcf-cfr', 'tcf-b1', 'tcm-csc', 'tcm-cfr']
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
      const token = role?.startsWith('cfu_') ? role : role ? `${role}-fixture` : ''
      const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
      const response = await worker.fetch(new Request(`https://fiches.example${path}`, { method, headers, ...(body ? { body: JSON.stringify(body) } : {}) }), env)
      return { status: response.status, body: await response.json() }
    } }
  }
  const data = (...domains) => ({ name: 'Fiche de vérification', recipe: { ...template, libreMode: false, libreSnapshot: null, pages: domains.map(domain => ({ ...template.pages[0], domain })) } })

  await test('full client access includes all TCF/TCM tests without a domain environment variable', async () => {
    const { domainsForAccount, accountCanAccessDomain } = await clientAccess()
    const allowed = domainsForAccount('full')
    for (const domain of ['algèbre', 'grammaire', ...tests]) assert(allowed.includes(domain), domain)
    assert.equal(new Set(allowed).size, allowed.length)
    assert.equal(accountCanAccessDomain(null, 'tcf-csc'), false)
    assert.equal(accountCanAccessDomain('partial', 'tcf-csc'), false)
    assert.equal(accountCanAccessDomain('partial', 'tcf-b1'), false)
    assert.deepEqual(new Set(domainsForAccount('partial')), new Set(['algèbre','géométrie','alphabetisation']))
  })

  await test('an old full domain configuration retains its selection and gains the TCF/TCM tests', async () => {
    const { domainsForAccount } = await clientAccess('algèbre,tcm-csc')
    assert.deepEqual(new Set(domainsForAccount('full')), new Set(['algèbre', ...tests]))
    assert(!domainsForAccount('full').includes('tpf'))
    assert(!domainsForAccount('full').includes('tpm'))
    assert(domainsForAccount('admin').includes('tpf'))
  })

  for (const configured of [undefined, 'algèbre']) {
    await test(`full can save, list and update all tests with ${configured ? 'an old' : 'no'} server domain configuration`, async () => {
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

  await test('le client retrouve le double A5 et les verrous après un aller-retour Worker', async () => {
    const { parseFicheRecipe, buildFicheRecipe } = await vite.ssrLoadModule('/src/fiches/recipe.ts')
    const h = harness()
    try {
      const base = data('algèbre')
      const original = await h.request('POST', '/fiches', base, 'partial')
      assert.equal(original.status, 201)
      assert(parseFicheRecipe(original.body.fiche.recipe))
      const half = {
        id: 'droite-temoin', instruction: 'Calculez.', items: [
          { layout: 'inline', op: '+', a: 9, b: 7, result: 16, answer: '16', libreId: 'addition-temoin', libreLocked: true },
        ],
      }
      const imageOverrides = {
        '/lib/images/temoin.webp': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAFElEQVR4nGPU9r7DgA0wYRUdtBIAC9IBYkd6Sd0AAAAASUVORK5CYII=',
      }
      const enriched = parseFicheRecipe({ ...base.recipe, sheetFormat: 'a5-double-landscape', imageOverrides, pages: [{
        domain: 'algèbre', topic: 'addition', exerciseType: 'addition-ligne', difficulty: 'moyen', count: 1, columns: 1,
        a5RightLibre: half,
      }] })
      assert(enriched)
      const route = `/fiches/${original.body.fiche.id}`
      const saved = await h.request('PUT', route, { ...base, recipe: buildFicheRecipe(enriched) }, 'partial')
      assert.equal(saved.status, 200)
      const listed = await h.request('GET', '/fiches', undefined, 'partial')
      const parsed = parseFicheRecipe(listed.body.fiches[0].recipe)
      assert.equal(parsed.sheetFormat, enriched.sheetFormat)
      assert.deepEqual(parsed.pages[0].a5RightLibre, half)
      assert.deepEqual(parsed.imageOverrides, imageOverrides)
      const invalid = structuredClone(saved.body.fiche.recipe)
      invalid.pages[0].a5RightLibre.items.push(half.items[0])
      assert.equal(parseFicheRecipe(invalid), null)
      assert.equal((await h.request('PUT', route, { ...base, recipe: invalid }, 'partial')).status, 400)
      const ephemeral = { ...saved.body.fiche.recipe, imageOverrides: { '/lib/images/temoin.webp': 'blob:https://exemple.invalid/image' } }
      assert.equal((await h.request('PUT', route, { ...base, recipe: ephemeral }, 'partial')).status, 400)
    } finally { h.close() }
  })

  await test('les comptes enseignants AFP et CFC gardent leurs droits et fiches distincts', async () => {
    const h = harness()
    try {
      const create = async (diploma) => {
        const credentials = { email: `test-libre-${diploma}@admin.vs.ch`, password: 'Temoin-2026!' }
        const account = await h.request('POST', '/users', { ...credentials, givenName: 'Enseignant', familyName: diploma, domains: [`logistique-${diploma}`] }, 'admin')
        assert.equal(account.status, 201)
        const login = await h.request('POST', '/auth/login', credentials, null)
        assert.equal(login.status, 200)
        return login.body.token
      }
      const [afp, cfc] = await Promise.all([create('afp'), create('cfc')])
      const load = (diploma) => ({ ...data(`logistique-${diploma}`), recipe: {
        ...data(`logistique-${diploma}`).recipe,
        pages: [{
          domain: `logistique-${diploma}`, topic: `log-${diploma}-theme-100`, exerciseType: `log-${diploma}-101-theorie`,
          difficulty: 'moyen', count: 1, columns: 1,
          libreItems: [{ layout: 'theory', answer: '', theoryBlock: { kind: 'heading', text: `Cours ${diploma}` } }],
        }],
      } })
      const own = await h.request('POST', '/fiches', load('afp'), afp)
      assert.equal(own.status, 201)
      assert.equal((await h.request('POST', '/fiches', load('cfc'), afp)).status, 403)
      assert.equal((await h.request('POST', '/fiches', load('cfc'), cfc)).status, 201)
      const other = await h.request('GET', '/fiches', undefined, cfc)
      assert.deepEqual(other.body.fiches.map((fiche) => fiche.domains), [['logistique-cfc']])
      assert.equal((await h.request('PUT', `/fiches/${own.body.fiche.id}`, load('afp'), cfc)).status, 404)
    } finally { h.close() }
  })
} finally {
  await vite.close()
  if (originalTimingSafeEqual) Object.defineProperty(crypto.subtle, 'timingSafeEqual', originalTimingSafeEqual)
  else delete crypto.subtle.timingSafeEqual
}
