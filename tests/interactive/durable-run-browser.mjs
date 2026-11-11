import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'vite'
import { chromium } from 'playwright'
const base = 'http://127.0.0.1:5182'
process.env.VITE_FICHES_API_URL = `${base}/__test_api`
const server = await createServer({ cacheDir: '/tmp/clairfle-durable-run-vite', server: { host: '127.0.0.1', port: 5182, strictPort: true } })
await server.listen()
const recipe = JSON.parse(await readFile('docs/interactive/demo-source-recipe.json', 'utf8'))
recipe.pages = [{ ...recipe.pages[0], count: 10, numberLibre: true, numberMin: 1, numberMax: 10, numberDecimals: false }]
delete recipe.pages[0].libreItems
recipe.libreMode = false
const saved = { id: 'durable-template', name: 'Additions durables', domains: ['algèbre'], recipe, createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-10T00:00:00Z' }
const original = structuredClone(recipe)
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] })
const results = []
const button = (page, name) => page.getByRole('button', { name, exact: true })
const selection = (page) => page.locator('.ci-question-list fieldset > label input')
async function records(page) {
  return page.evaluate(async () => { const { requestLocal } = await import('/src/interactive/storage.ts'); return requestLocal('sessions', 'readonly', (store) => store.getAll()) })
}
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  await context.addInitScript(() => localStorage.setItem('clairfle-fiche-sync', 'durable-fixture-only'))
  const methods = []
  await context.route('**/__test_api/fiches', async (route) => {
    methods.push(route.request().method())
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ fiches: [saved, { ...saved, id: 'other-template', name: 'Autre fiche' }] }) })
  })
  const first = await context.newPage()
  await first.goto(`${base}/interactif/${saved.id}`)
  await first.locator('.ci-launch:enabled').waitFor({ timeout: 120000 })
  await selection(first).last().uncheck()
  await first.getByRole('spinbutton', { name: 'Temps de réflexion (secondes)', exact: true }).fill('20')
  await button(first, 'Régler le minuteur').click()
  await first.getByRole('spinbutton', { name: 'Temps entre les questions (secondes)', exact: true }).fill('7')
  await button(first, 'Fermer les réglages').click()
  await button(first, 'Mascotte').click()
  await button(first, 'Dragon').click()
  await button(first, 'Mode de jeu').click()
  const prompts = await first.locator('.ci-question-list fieldset > label b').allTextContents()
  await first.locator('.ci-launch').click()
  await first.locator('.ci-solo-session .ci-controls').waitFor()
  await first.waitForURL('**?s=*')
  const url = first.url()
  const sessionId = new URL(url).searchParams.get('s')
  assert.match(sessionId, /^[\da-f-]{36}$/)
  await first.locator('.ci-answer').first().click()
  await first.locator('.ci-reveal').waitFor()
  await button(first, 'Pause').click()
  await button(first, 'Quitter la séance').click()
  await first.getByRole('button', { name: /Reprendre la séance/ }).waitFor()
  const before = (await records(first)).find((record) => record.sessionId === sessionId)
  assert.equal(before.source.selectedKeys.length, 9)
  assert.equal(before.source.timer.seconds, 20)
  assert.equal(before.source.timer.feedbackSeconds, 7)
  await first.close()

  const reopened = await context.newPage()
  await reopened.goto(`${base}/interactif/${saved.id}`)
  await reopened.locator('.ci-launch:enabled').waitFor({ timeout: 120000 })
  assert.deepEqual(await reopened.locator('.ci-question-list fieldset > label b').allTextContents(), prompts)
  assert.equal(await selection(reopened).last().isChecked(), false)
  assert.equal(await button(reopened, 'Mode de jeu').getAttribute('aria-pressed'), 'true')
  assert.equal(await reopened.getByRole('spinbutton', { name: 'Temps de réflexion (secondes)', exact: true }).inputValue(), '20')
  assert.equal(await reopened.locator('.ci-app').getAttribute('data-mascot'), 'dragon')
  assert.match(await reopened.locator('.ci-launch').innerText(), /Reprendre la séance/)
  await reopened.locator('.ci-launch').click()
  await reopened.locator('.ci-pause').waitFor()
  assert.equal(await reopened.locator('.ci-reveal').count(), 1)
  assert.equal(await reopened.locator('.ci-answer-key').count(), 1)
  await button(reopened, 'Quitter la séance').click()
  await reopened.getByRole('button', { name: /Reprendre la séance/ }).waitFor()
  await reopened.close()
  results.push({ newTab: 'same questions, seed, nine selected positions and Solo mode after original tab is closed', preferences: 'Dragon, 20 s reflection and 7 s feedback restored from IndexedDB', session: 'paused correction and its chosen answer resumed', serverWrites: 0 })

  const direct = await context.newPage()
  await direct.goto(url)
  await direct.getByRole('button', { name: /Reprendre la séance/ }).waitFor({ timeout: 120000 })
  assert.deepEqual(await direct.locator('.ci-question-list fieldset > label b').allTextContents(), prompts)
  await direct.locator('.ci-launch').click()
  await direct.locator('.ci-pause').waitFor()
  assert.equal(await direct.locator('.ci-reveal').count(), 1)
  await button(direct, 'Quitter la séance').click()
  await direct.getByRole('button', { name: /Reprendre la séance/ }).waitFor()
  const current = (await records(direct)).find((record) => record.sessionId === sessionId)
  assert.ok(current.source.reference.id === saved.id)
  const bad = await context.newPage()
  await bad.goto(`${base}/interactif/other-template?s=${sessionId}`)
  await bad.getByRole('alert').filter({ hasText: /appartient à une autre fiche/ }).waitFor()
  await bad.close()
  results.push({ directSessionAddress: 's=session UUID resolves the original source and exact plan', mismatchedSource: 'a session link cannot load another worksheet' })

  // An edited server template cannot silently replay the old plan.
  recipe.pages[0].count = 8
  const changed = await context.newPage()
  await changed.goto(url)
  await changed.getByRole('status').filter({ hasText: /La fiche ou le moteur a changé/ }).waitFor({ timeout: 120000 })
  assert.ok(await changed.locator('.ci-launch').isDisabled())
  await button(changed, 'Recommencer avec une nouvelle partie').click()
  await changed.locator('.ci-launch:enabled').waitFor()
  assert.equal(new URL(changed.url()).searchParams.has('s'), false)
  const after = (await records(changed)).find((record) => record.sessionId === sessionId)
  assert.deepEqual(after, current)
  await changed.close()
  recipe.pages[0].count = original.pages[0].count
  results.push({ changedTemplate: 'plan mismatch blocks accidental resume; explicit new game leaves old journal intact' })

  const preferenceResults = await direct.evaluate(async () => {
    const { readClassroomPreferences, patchClassroomPreferences } = await import('/src/interactive/preferences.ts')
    const { requestLocal } = await import('/src/interactive/storage.ts')
    const row = await requestLocal('settings', 'readonly', (store) => store.get('classroom'))
    await Promise.all([patchClassroomPreferences({ toolbarGuard: 'hold-to-reveal' }, row.settings), patchClassroomPreferences({ mascot: 'owl' }, row.settings)])
    const merged = await readClassroomPreferences(row.settings)
    const future = { ...row, schemaVersion: 99 }
    await requestLocal('settings', 'readwrite', (store) => store.put(future))
    let message = ''
    try { await patchClassroomPreferences({ mascot: 'rabbit' }, merged) } catch (error) { message = error.message }
    const retained = await requestLocal('settings', 'readonly', (store) => store.get('classroom'))
    return { merged, message, unchanged: JSON.stringify(future) === JSON.stringify(retained) }
  })
  assert.equal(preferenceResults.merged.toolbarGuard, 'hold-to-reveal')
  assert.equal(preferenceResults.merged.mascot, 'owl')
  assert.equal(preferenceResults.merged.timer.seconds, 20)
  assert.match(preferenceResults.message, /conservées/)
  assert.equal(preferenceResults.unchanged, true)
  results.push({ concurrentPreferences: 'independent changes merge atomically without losing timer settings', futurePreferences: 'unknown schema preserved and update refused' })
  assert.ok(methods.length >= 4 && methods.every((method) => method === 'GET'))
  assert.deepEqual(recipe, original)
  await direct.close()
  await writeFile('docs/interactive/durable-run-results.json', JSON.stringify(results, null, 2) + '\n')
  console.log(JSON.stringify(results, null, 2))
} finally { await browser.close(); await server.close() }
