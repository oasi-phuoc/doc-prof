import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'

const base = process.env.INTERACTIVE_TEST_URL ?? 'http://127.0.0.1:5180'
const recipe = JSON.parse(await readFile('docs/interactive/demo-source-recipe.json', 'utf8'))
recipe.pages = recipe.pages.slice(0, 2)
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] })
const results = []
async function openPage() {
  const page = await browser.newPage()
  page.setDefaultTimeout(30000)
  await page.context().addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  await page.goto(base)
  return page
}
async function stageGenerator(page) {
  await page.evaluate((recipe) => {
    history.pushState({ clairfleFiche: { id: 'durable-draft-fixture', name: 'Mon brouillon durable', recipe } }, '', '/generateur')
    dispatchEvent(new PopStateEvent('popstate'))
  }, recipe)
  await page.locator('.a4-frame').first().waitFor({ timeout: 120000 })
}
async function rows(page, store) {
  return page.evaluate(async (name) => {
    const { requestLocal } = await import('/src/interactive/storage.ts')
    return requestLocal(name, 'readonly', (store) => store.getAll())
  }, store)
}
try {
  const page = await openPage()
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  // Upgrade an existing installation without destroying its sessions.
  await page.evaluate(async () => {
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open('clairfle-interactive', 1)
      request.onupgradeneeded = () => request.result.createObjectStore('sessions', { keyPath: 'gameId' })
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    await new Promise((resolve, reject) => {
      const tx = db.transaction('sessions', 'readwrite')
      tx.objectStore('sessions').put({ gameId: 'migration-sentinel', schemaVersion: 99, protected: true })
      tx.oncomplete = resolve
      tx.onabort = () => reject(tx.error)
    })
    db.close()
  })
  await stageGenerator(page)
  await page.getByRole('button', { name: 'Jouer avec la classe', exact: true }).click()
  await page.waitForURL('**/interactif?d=*')
  await page.locator('.ci-launch:enabled').waitFor({ timeout: 120000 })
  const url = page.url()
  const id = new URL(url).searchParams.get('d')
  assert.match(id, /^[\da-f-]{36}$/)
  const saved = (await rows(page, 'drafts')).find((row) => row.draftId === id)
  const handoff = await page.evaluate(() => history.state.clairfleInteractive)
  assert.deepEqual(saved.recipe, handoff.recipe)
  assert.equal(saved.schemaVersion, 1)
  assert.equal(saved.name, 'Mon brouillon durable')
  assert.equal(saved.recipe.seed, recipe.seed)
  assert.deepEqual(saved.recipe.pages.map((p) => p.libreItems), recipe.pages.map((p) => p.libreItems))
  assert.deepEqual(await rows(page, 'sessions'), [{ gameId: 'migration-sentinel', schemaVersion: 99, protected: true }])
  const stores = await page.evaluate(async () => { const { openInteractiveDatabase } = await import('/src/interactive/storage.ts'); const db = await openInteractiveDatabase(); return { version: db.version, names: [...db.objectStoreNames] } })
  assert.deepEqual(stores, { version: 4, names: ['drafts', 'presets-local', 'sessions', 'settings'] })
  const prompts = await page.locator('.ci-question-list fieldset > label b').allTextContents()
  assert.equal(prompts.length, 3)
  await page.evaluate(async (id) => {
    const { requestLocal } = await import('/src/interactive/storage.ts')
    const row = await requestLocal('drafts', 'readonly', (store) => store.get(id))
    await requestLocal('drafts', 'readwrite', (store) => store.put({ ...row, lastOpenedAt: Date.now() - 60 * 60 * 1000 }))
  }, id)
  // An address opened directly has no navigation state to fall back on.
  await page.evaluate(() => history.replaceState(null, '', location.href))
  await page.goto(url)
  await page.locator('.ci-launch:enabled').waitFor({ timeout: 120000 })
  assert.equal(await page.evaluate(() => history.state?.clairfleInteractive ?? null), null)
  assert.deepEqual(await page.locator('.ci-question-list fieldset > label b').allTextContents(), prompts)
  assert.ok(Date.now() - (await rows(page, 'drafts')).find((row) => row.draftId === id).lastOpenedAt < 10000)
  await page.locator('.ci-launch').click()
  await page.getByRole('button', { name: 'Signal : levez vos cartes', exact: true }).click()
  await page.getByRole('button', { name: 'Quitter la séance', exact: true }).click()
  await page.getByRole('button', { name: /Reprendre la séance/ }).waitFor()
  await page.reload()
  await page.getByRole('button', { name: /Reprendre la séance/ }).click()
  await page.getByRole('button', { name: 'Discuter', exact: true }).waitFor()
  assert.equal(await page.locator('.ci-answer-key, .ci-answer-muted').count(), 0)
  await page.getByRole('button', { name: 'Quitter la séance', exact: true }).click()
  await page.getByRole('button', { name: /Reprendre la séance/ }).waitFor()
  results.push({ launch: 'real generator action creates a random draft URL and an exact snapshot', migration: 'database 1 → 4 retains sessions and adds drafts/settings/presets-local and session indexes', reload: 'direct address with no history restores identical questions and renews lastOpenedAt', session: 'collective voting phase resumes without revealing answers' })

  const fixture = await page.evaluate(async (saved) => {
    const { requestLocal } = await import('/src/interactive/storage.ts')
    const now = Date.now()
    const ids = Object.fromEntries(['expired', 'future', 'invalid', 'missing'].map((name) => [name, crypto.randomUUID()]))
    for (const record of Object.values({
      expired: { ...saved, draftId: ids.expired, lastOpenedAt: now - 25 * 60 * 60 * 1000 },
      future: { ...saved, draftId: ids.future, schemaVersion: 99, lastOpenedAt: now - 25 * 60 * 60 * 1000 },
      invalid: { ...saved, draftId: ids.invalid, lastOpenedAt: 'not-a-date' },
    })) await requestLocal('drafts', 'readwrite', (store) => store.put(record))
    return ids
  }, saved)
  for (const [name, expected] of [['expired', /introuvable ou a expiré/], ['future', /Version de brouillon non prise en charge/], ['invalid', /Brouillon invalide/], ['missing', /introuvable ou a expiré/]]) {
    // Stale history must never bypass validation of a persistent draft URL.
    await page.evaluate(({ id, data }) => { history.pushState({ clairfleInteractive: data }, '', `/interactif?d=${id}`); dispatchEvent(new PopStateEvent('popstate')) }, { id: fixture[name], data: handoff })
    await page.getByRole('alert').filter({ hasText: expected }).waitFor()
    assert.equal(await page.locator('.ci-launch').count(), 0)
    assert.equal(await page.getByRole('link', { name: 'Ouvrir le générateur', exact: true }).getAttribute('href'), '/generateur')
  }
  await page.evaluate(async () => { const { purgeExpiredDrafts } = await import('/src/interactive/drafts.ts'); await purgeExpiredDrafts() })
  const retained = await rows(page, 'drafts')
  assert.ok(!retained.some((row) => row.draftId === fixture.expired))
  assert.deepEqual(retained.find((row) => row.draftId === fixture.future), { ...saved, draftId: fixture.future, schemaVersion: 99, lastOpenedAt: retained.find((row) => row.draftId === fixture.future).lastOpenedAt })
  assert.ok(Date.now() - retained.find((row) => row.draftId === fixture.future).lastOpenedAt > 24 * 60 * 60 * 1000)
  assert.equal(retained.find((row) => row.draftId === fixture.invalid).lastOpenedAt, 'not-a-date')
  await page.goto(`${base}/interactif?d=invalid`)
  await page.getByRole('alert').filter({ hasText: /introuvable ou a expiré/ }).waitFor()
  assert.deepEqual(errors, [])
  results.push({ retention: '24 hours after last opening; expired drafts removed, unknown schemas and invalid dates preserved', invalidLinks: 'clear error and generator link; stale history cannot bypass the stored record' })
  await page.close()

  const fallback = await openPage()
  await fallback.addInitScript(() => Object.defineProperty(globalThis, 'indexedDB', { configurable: true, value: { open() { throw new DOMException('Storage unavailable', 'SecurityError') } } }))
  await fallback.reload()
  await stageGenerator(fallback)
  await fallback.getByRole('button', { name: 'Jouer avec la classe', exact: true }).click()
  await fallback.waitForURL(`${base}/interactif`)
  await fallback.locator('.ci-launch:enabled').waitFor({ timeout: 120000 })
  assert.match(await fallback.getByRole('status').filter({ hasText: /Ce brouillon reste dans cet onglet/ }).innerText(), /enregistrement local est indisponible/)
  await fallback.locator('.ci-launch').click()
  await fallback.getByRole('button', { name: 'Signal : levez vos cartes', exact: true }).waitFor()
  await fallback.close()
  results.push({ unavailableStorage: 'generator-to-game handoff remains playable in the current tab, with a visible warning' })

  const images = await openPage()
  const inline = { ...recipe, imageOverrides: { transient: 'data:image/png;base64,AA==' } }
  await images.evaluate(async (recipe) => { const { openInteractive } = await import('/src/interactive/navigation.ts'); await openInteractive(recipe, 'Image intégrée') }, inline)
  await images.locator('.ci-launch:enabled').waitFor({ timeout: 120000 })
  assert.equal(new URL(images.url()).search, '')
  assert.equal((await rows(images, 'drafts')).length, 0)
  assert.ok(await images.getByRole('status').filter({ hasText: /Ce brouillon reste dans cet onglet/ }).isVisible())
  const reference = await images.evaluate(async (recipe) => {
    const { createLocalDraft, loadLocalDraft } = await import('/src/interactive/drafts.ts')
    recipe.imageOverrides = { transient: 'blob:http://127.0.0.1/reference-only' }
    const pending = createLocalDraft(recipe, 'Référence temporaire')
    recipe.seed = 123
    recipe.pages[0].count = 42
    const id = await pending
    const loaded = await loadLocalDraft(id)
    return { loaded, id }
  }, recipe)
  assert.equal(reference.loaded.recipe.seed, recipe.seed)
  assert.equal(reference.loaded.recipe.pages[0].count, recipe.pages[0].count)
  assert.equal(reference.loaded.recipe.imageOverrides.transient, 'blob:http://127.0.0.1/reference-only')
  assert.ok(!JSON.stringify(await rows(images, 'drafts')).includes('data:image/'))
  results.push({ images: 'only image references persist; inline bytes use the current-tab handoff', snapshot: 'later changes to the source object cannot change the stored draft' })
  await images.close()
  await writeFile('docs/interactive/drafts-results.json', JSON.stringify(results, null, 2) + '\n')
  console.log(JSON.stringify(results, null, 2))
} finally { await browser.close() }
