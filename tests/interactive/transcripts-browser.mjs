import assert from 'node:assert/strict'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'vite'
import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'
import { waitForBrowserValue } from './browser-actions.mjs'

const base = 'http://127.0.0.1:5182'
process.env.VITE_FICHES_API_URL = base + '/__test_api'
const server = await createServer({ cacheDir: '/tmp/clairfle-transcripts-vite', server: { host: '127.0.0.1', port: 5182, strictPort: true } })
await server.listen()
const { demoRecipe } = await server.ssrLoadModule('/src/interactive/demo.ts')
const { defaultPage } = await server.ssrLoadModule('/src/math/catalog.ts')
const bank = JSON.parse(await readFile('src/tcf/content/a0-a1/co.json', 'utf8'))
const candidates = bank.filter(ex => ex.type_exercice === 'complet' && ex.support.audio && typeof ex.support.transcription === 'string' && ex.support.transcription.trim() && ex.questions.length >= 2)
const first = candidates[0], second = candidates.find(ex => ex.support.audio !== first.support.audio)
const recipe = { ...demoRecipe(), libreMode: false, pages: [first, second].map((ex, index) => ({ ...defaultPage('tcf-csc'), topic: 'tcf-co', exerciseType: 'tcf-co-ex-3', count: 1, tcfExercise: { ...ex, questions: ex.questions.slice(0, index ? 1 : 2) }, libreItems: undefined, extraBlocks: undefined })) }
const original = structuredClone(recipe), text = first.support.transcription.trim()
const saved = { id: 'transcripts-source', name: 'Relecture des écoutes', recipe, domains: ['tcf-csc'], createdAt: '2026-11-13T00:00:00Z', updatedAt: '2026-11-13T00:00:00Z' }
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] })
const results = [], errors = [], methods = []
const button = (page, name) => page.getByRole('button', { name, exact: true })
const review = page => button(page, 'Lire la transcription')
const dialog = page => page.getByRole('dialog', { name: 'Transcription de l’écoute', exact: true })
const option = page => page.getByRole('checkbox', { name: 'Proposer la transcription après les réponses', exact: true })
async function setup(width = 390, height = 844) {
  const context = await browser.newContext({ viewport: { width, height } })
  await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  await context.addInitScript(() => {
    localStorage.setItem('clairfle-fiche-sync', 'transcripts-fixture-only')
    localStorage.setItem('clairfle.interactive.timer.v1', JSON.stringify({ enabled: false, seconds: 30, feedbackSeconds: 3 }))
  })
  await context.route('**/__test_api/fiches', async route => { methods.push(route.request().method()); await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ fiches: [saved] }) }) })
  const page = await context.newPage(); page.on('pageerror', error => errors.push(error.message))
  await page.goto(`${base}/interactif/${saved.id}`)
  await page.locator('.ci-launch:enabled').waitFor({ timeout: 120000 })
  return { page, context }
}
async function reveal(page) {
  await button(page, 'Signal : levez vos cartes').click()
  await button(page, 'Discuter').click()
  await button(page, 'Enseignant : révéler').click()
}
async function noText(page) {
  assert.equal(await dialog(page).count(), 0)
  assert.equal(await page.getByText(text, { exact: true }).count(), 0)
}
async function bounds(page) {
  const viewport = page.viewportSize()
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
  for (const locator of [review(page), page.locator('.ci-controls'), page.locator('.ci-header-audio')]) {
    const rect = await locator.boundingBox()
    assert.ok(rect && rect.x >= -1 && rect.y >= -1 && rect.x + rect.width <= viewport.width + 1 && rect.y + rect.height <= viewport.height + 1, JSON.stringify(rect))
  }
}
try {
  await mkdir('docs/interactive/screenshots', { recursive: true })
  for (const [width, height] of [[390, 844], [1366, 768], [360, 640]]) {
    const { page, context } = await setup(width, height)
    assert.equal(await option(page).isChecked(), true)
    await page.locator('.ci-launch').click()
    assert.equal(await review(page).count(), 0); await noText(page)
    await reveal(page)
    await review(page).waitFor()
    await bounds(page)
    await review(page).click()
    assert.equal((await dialog(page).locator('.ci-text-dialog-body p').innerText()).trim(), text)
    await dialog(page).locator('.ci-text-dialog-body').focus()
    await page.keyboard.press('Enter')
    assert.match(await page.locator('.ci-progress').innerText(), /Questions 1 et 2/)
    await page.keyboard.press('Escape')
    await noText(page)
    assert.equal(await review(page).evaluate(node => node === document.activeElement), true)
    await button(page, 'Masquer à nouveau').click()
    assert.equal(await review(page).count(), 0); await noText(page)
    await button(page, 'Enseignant : révéler').click()
    await button(page, 'Verrouiller les commandes').click()
    assert.equal(await review(page).isDisabled(), true)
    await button(page, 'Déverrouiller les commandes').click()
    await review(page).click()
    const a11y = await new AxeBuilder({ page }).analyze()
    assert.deepEqual(a11y.violations.map(item => ({ id: item.id, impact: item.impact })), [])
    const rect = await dialog(page).boundingBox()
    assert.ok(rect.x >= 0 && rect.y >= 0 && rect.x + rect.width <= width && rect.y + rect.height <= height)
    await page.screenshot({ path: `docs/interactive/screenshots/transcript-${width}.png`, fullPage: true })
    await button(page, 'Fermer la lecture').click()
    await review(page).click()
    // Exercise the browser visibility event without depending on the window
    // manager used by headless Chromium to background tabs.
    await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, value: true }); document.dispatchEvent(new Event('visibilitychange')) })
    await dialog(page).waitFor({ state: 'hidden' })
    await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')) })
    await waitForBrowserValue(page, () => document.querySelector('[aria-label="Lire la transcription"]')?.disabled === false)
    await noText(page)
    await page.reload()
    await button(page, 'Reprendre la séance').click()
    await review(page).waitFor(); await noText(page)
    // A new attempt must remove access, even after a restored correction.
    await page.getByRole('button', { name: /^Choisir une question ·/ }).click()
    await button(page, 'Réessayer cette question').click()
    await button(page, 'Nouvelle tentative').click()
    assert.equal(await review(page).count(), 0); await noText(page)
    results.push({ viewport: `${width}x${height}`, class: 'shared recording hidden before correction; exact bank text, Escape, focus restoration, retraction, teacher lock and retry verified', visibility: 'simulated browser visibility events close reading permanently until another click', reload: 'corrected answers restore review availability; reading window stays closed', layout: 'audio, review button, footer and dialog inside viewport', axeViolations: a11y.violations.length })
    await context.close()
  }

  const solo = await setup()
  const page = solo.page
  await button(page, 'Mode de jeu').click()
  await page.clock.install()
  await page.locator('.ci-launch').click()
  await page.locator('.ci-answer').first().click()
  assert.equal(await review(page).count(), 0); await noText(page)
  await page.locator('.ci-progress').filter({ hasText: 'Question 2 / 3' }).waitFor()
  await page.locator('.ci-answer').first().click()
  await review(page).waitFor()
  await page.clock.pauseAt(new Date(Date.now() + 100))
  await page.clock.runFor(1000)
  await review(page).click()
  const remainingBefore = await page.getByRole('timer', { name: 'Temps avant la question suivante', exact: true }).innerText()
  await page.clock.runFor(12000)
  assert.equal(await page.getByRole('timer', { name: 'Temps avant la question suivante', exact: true }).innerText(), remainingBefore)
  assert.match(await page.locator('.ci-progress').innerText(), /Question 2 \/ 3/)
  assert.equal((await dialog(page).locator('p').innerText()).trim(), text)
  await page.keyboard.press('Escape')
  await page.clock.runFor(900)
  assert.match(await page.locator('.ci-progress').innerText(), /Question 2 \/ 3/)
  await page.clock.runFor(1500)
  assert.match(await page.locator('.ci-progress').innerText(), /Question 3 \/ 3/)
  assert.equal(await review(page).count(), 0); await noText(page)
  results.push({ solo: 'first answer cannot reveal the second; final correction unlocks transcript; twelve seconds of reading suspend progression; close resumes the remaining two seconds rather than restarting three' })
  await solo.context.close()

  const preferences = await setup(1366, 768)
  const prefPage = preferences.page
  await option(prefPage).uncheck()
  await waitForBrowserValue(prefPage, async () => { const { requestLocal } = await import('/src/interactive/storage.ts'); return (await requestLocal('settings', 'readonly', store => store.get('classroom')))?.settings.showTranscripts === false })
  await prefPage.reload()
  await prefPage.locator('.ci-launch:enabled').waitFor()
  assert.equal(await option(prefPage).isChecked(), false)
  await prefPage.locator('.ci-launch').click(); await reveal(prefPage)
  assert.equal(await review(prefPage).count(), 0); await noText(prefPage)
  const checks = await prefPage.evaluate(async () => {
    const { requestLocal } = await import('/src/interactive/storage.ts')
    const { readClassroomPreferences, patchClassroomPreferences } = await import('/src/interactive/preferences.ts')
    const row = await requestLocal('settings', 'readonly', store => store.get('classroom'))
    const legacy = structuredClone(row); delete legacy.settings.showTranscripts
    await requestLocal('settings', 'readwrite', store => store.put(legacy))
    const previous = await readClassroomPreferences(legacy.settings)
    await Promise.all([patchClassroomPreferences({ showTranscripts: false }, previous), patchClassroomPreferences({ mascot: 'owl' }, previous)])
    const merged = await readClassroomPreferences(previous)
    let rejected = false
    try { await patchClassroomPreferences({ showTranscripts: 'yes' }, merged) } catch { rejected = true }
    return { legacyAccepted: previous.showTranscripts === undefined, merged, rejected, preserved: JSON.stringify(await readClassroomPreferences(previous)) === JSON.stringify(merged) }
  })
  assert.ok(checks.legacyAccepted && checks.rejected && checks.preserved)
  assert.equal(checks.merged.showTranscripts, false); assert.equal(checks.merged.mascot, 'owl'); assert.equal(checks.merged.timer.enabled, false)
  results.push({ preference: 'off survives reload and suppresses review after correction; old settings accepted; concurrent mascot/transcript patches preserve both and timer; malformed values rejected without writes' })
  await preferences.context.close()
  assert.deepEqual(recipe, original)
  assert.ok(methods.length && methods.every(method => method === 'GET'))
  assert.deepEqual(errors, [])
  results.push({ source: 'two real TCF bank recordings with exact stored texts; no generated audio', sourceTemplate: 'unchanged', serverWrites: 0, errors })
  await writeFile('docs/interactive/transcripts-results.json', JSON.stringify(results, null, 2) + '\n')
  console.log(JSON.stringify(results, null, 2))
} finally { await browser.close(); await server.close() }
