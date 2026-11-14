import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { setTimeout as delay } from 'node:timers/promises'
import { createServer } from 'vite'
import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'
import { waitForBrowserValue } from './browser-actions.mjs'
import { classroomRecipe } from './classroom-fixture.mjs'

const base = 'http://127.0.0.1:5182'
process.env.VITE_FICHES_API_URL = base + '/__test_api'
const vite = await createServer({ cacheDir: '/tmp/clairfle-teacher-console-browser', server: { host: '127.0.0.1', port: 5182, strictPort: true } })
await vite.listen()
const { demoRecipe } = await vite.ssrLoadModule('/src/interactive/demo.ts')
const { defaultPage } = await vite.ssrLoadModule('/src/math/catalog.ts')
const { convertRecipe } = await vite.ssrLoadModule('/src/interactive/domain/convert.ts')
const recipe = { ...demoRecipe(), seed: 20261114, pages: [
  { ...defaultPage('tcf-csc'), topic: 'tcf-po', exerciseType: 'tcf-po', tcfBankId: 'tcf-a0a1-po-img-accident-velo', count: 1, extraBlocks: undefined },
  { ...defaultPage('algèbre'), count: 2, libreItems: [{ layout: 'inline', a: 2, b: 2, op: '+', missing: 'result', answer: '4' }, { layout: 'inline', a: 3, b: 3, op: '+', missing: 'result', answer: '6' }] },
] }
const original = structuredClone(recipe), source = convertRecipe(recipe), model = source.corrections[source.questions[0].id].text
assert.equal(source.questions.length, 3)
const saved = { id: 'teacher-console-fixture', name: 'Récit et calculs', domains: ['tcf-csc', 'algèbre'], recipe, createdAt: '2026-11-14T00:00:00Z', updatedAt: '2026-11-14T00:00:00Z' }
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] })
const errors = [], methods = [], results = []
let activeProjection, activeConsole
const button = (page, name) => page.getByRole('button', { name, exact: true })
async function openConsole(page, context, width, height) {
  const created = context.waitForEvent('page')
  await button(page, 'Ouvrir la console enseignant').click()
  const consolePage = await created
  activeConsole = consolePage
  consolePage.on('pageerror', error => errors.push(error.message))
  consolePage.setDefaultTimeout(30000)
  await consolePage.setViewportSize({ width: width > 700 ? 1040 : width, height: height > 800 ? height : 820 })
  await consolePage.getByRole('heading', { name: 'Console enseignant', exact: true }).waitFor({ timeout: 120000 })
  await consolePage.getByRole('status').filter({ hasText: 'Projection connectée.' }).waitFor()
  assert.equal(await consolePage.evaluate(() => window.opener === null), true)
  return consolePage
}
async function privateModel(page, consolePage) {
  assert.equal(await page.locator('.ci-model-answer').count(), 0)
  assert.ok(!(await page.locator('body').textContent()).includes(model))
  assert.equal(await consolePage.locator('.ci-console-model').innerText(), model)
}
async function hold(consolePage, projection, complete) {
  const reveal = button(consolePage, 'Enseignant : révéler')
  await reveal.focus(); await consolePage.keyboard.down('Enter')
  if (complete) await projection.locator('.ci-reveal').waitFor()
  else await delay(250)
  await consolePage.keyboard.up('Enter')
  if (!complete) { await delay(750); assert.equal(await projection.locator('.ci-reveal').count(), 0) }
}
async function axe(page) {
  const report = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
  assert.deepEqual(report.violations.map(issue => ({ id: issue.id, targets: issue.nodes.map(node => node.target) })), [])
}
async function fits(page) {
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
  const viewport = page.viewportSize()
  for (const control of await page.locator('.ci-header button:visible,.ci-controls button:visible').all()) {
    const box = await control.boundingBox()
    assert.ok(box && box.x >= -1 && box.x + box.width <= viewport.width + 1 && box.y >= -1 && box.y + box.height <= viewport.height + 1, JSON.stringify({ viewport, box }))
  }
}
try {
  await mkdir('docs/interactive/screenshots', { recursive: true })
  for (const [width, height] of [[1366, 900], [390, 844], [360, 640]].filter(([width]) => !process.env.CONSOLE_TEST_WIDTH || width === Number(process.env.CONSOLE_TEST_WIDTH))) {
    console.log(`Teacher console ${width}x${height}`)
    const context = await browser.newContext({ viewport: { width, height } })
    await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
    await context.addInitScript(width => {
      localStorage.setItem('clairfle-fiche-sync', 'teacher-console-fixture-only')
      localStorage.setItem('clairfle.interactive.timer.v1', JSON.stringify({ enabled: width === 1366, seconds: 120, feedbackSeconds: 1 }))
      localStorage.setItem('clairfle.interactive.mode.v1', 'class')
      localStorage.setItem('clairfle.interactive.toolbar-guard.v1', JSON.stringify('hold-to-reveal'))
    }, width)
    await context.route('**/__test_api/fiches', route => { methods.push(route.request().method()); return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ fiches: [saved] }) }) })
    const page = await context.newPage(); page.on('pageerror', error => errors.push(error.message))
    activeProjection = page
    await page.goto(`${base}/interactif/${saved.id}`)
    await page.locator('.ci-launch:enabled').waitFor({ timeout: 120000 })
    await button(page, 'Précharger toute la séance').click()
    await page.getByRole('status').filter({ hasText: 'Prêt à jouer sans connexion' }).waitFor({ timeout: 120000 })
    await page.locator('.ci-launch').click(); await page.locator('.ci-controls').waitFor()
    await fits(page)
    if (width === 1366) {
      await page.evaluate(() => { window.__consoleFixtureOpen = window.open; window.open = () => null })
      await button(page, 'Ouvrir la console enseignant').click()
      await page.getByRole('alert').filter({ hasText: 'La fenêtre de la console a été bloquée.' }).waitFor()
      assert.equal(await button(page, 'Commencer l’échange').count(), 1)
      await page.evaluate(() => { window.open = window.__consoleFixtureOpen; delete window.__consoleFixtureOpen })
    }
    let consolePage = await openConsole(page, context, width, height)
    const consoleApi = []
    consolePage.on('request', request => { if (request.url().includes('/__test_api/')) consoleApi.push(request.url()) })
    await privateModel(page, consolePage)
    await axe(consolePage); await fits(consolePage)
    await page.screenshot({ path: `docs/interactive/screenshots/teacher-console-projection-${width}.png` })
    await consolePage.screenshot({ path: `docs/interactive/screenshots/teacher-console-${width}.png`, fullPage: true })
    await context.setOffline(true)
    await button(consolePage, 'Commencer l’échange').click()
    await button(consolePage, 'Afficher la relance suivante').click()
    await page.locator('.ci-guided-hints .ci-hint-history p').first().waitFor()
    assert.match(await consolePage.locator('.ci-console-hints li').first().innerText(), /affichée/)
    await button(consolePage, 'Verrouiller les commandes').click()
    await button(page, 'Déverrouiller les commandes').waitFor()
    assert.ok(await button(consolePage, 'Discuter').isDisabled())
    assert.ok(await button(consolePage, 'Pause').isDisabled())
    await button(consolePage, 'Déverrouiller les commandes').click()
    await button(consolePage, 'Pause').click(); await page.locator('.ci-pause').waitFor()
    await button(consolePage, 'Reprendre').click(); await page.locator('.ci-pause').waitFor({ state: 'detached' })
    if (width === 1366) {
      await page.bringToFront(); await button(page, 'Passer').click()
      await page.getByRole('dialog', { name: 'Passer cette question ?', exact: true }).waitFor()
      await consolePage.getByRole('status').filter({ hasText: 'Fermez le panneau ouvert' }).waitFor()
      assert.ok(await button(consolePage, 'Discuter').isDisabled())
      await button(page, 'Annuler').click(); await button(consolePage, 'Discuter').waitFor({ state: 'visible' })
    }
    await consolePage.bringToFront(); await button(consolePage, 'Discuter').click()
    await privateModel(page, consolePage)
    await hold(consolePage, page, false)
    await hold(consolePage, page, true)
    assert.ok((await page.locator('.ci-model-content').innerText()).includes(model))
    await button(consolePage, 'Acquis').click()
    await waitForBrowserValue(page, async () => {
      const { requestLocal } = await import('/src/interactive/storage.ts')
      const rows = await requestLocal('sessions', 'readonly', store => store.getAll())
      return rows.some(row => row.events.some(event => event.action.type === 'ASSESS' && event.action.value === 'acquired'))
    })
    await button(consolePage, 'Masquer à nouveau').click(); await page.locator('.ci-reveal').waitFor({ state: 'detached' })
    await privateModel(page, consolePage)
    await hold(consolePage, page, true)
    await button(consolePage, 'Question suivante').click()
    await page.locator('.ci-progress').filter({ hasText: 'Question 2 / 3' }).waitFor()
    const answerLetter = await consolePage.locator('.ci-console-answer .ci-card-badge b').innerText()
    assert.equal(await page.locator('.ci-answer-key').count(), 0)
    await button(consolePage, 'Signal : levez vos cartes').click(); await button(consolePage, 'Discuter').click(); await hold(consolePage, page, true)
    assert.equal(await page.locator('.ci-answer-key .ci-card-badge b').innerText(), answerLetter)
    await button(consolePage, 'Nouvelle tentative').click()
    const retry = consolePage.getByRole('dialog', { name: 'Réessayer cette question ?', exact: true })
    await retry.getByRole('button', { name: 'Nouvelle tentative', exact: true }).click()
    await page.locator('.ci-progress').filter({ hasText: 'Question 2 / 3' }).waitFor()
    await button(consolePage, 'Signal : levez vos cartes').waitFor()
    assert.notEqual(await consolePage.locator('.ci-console-answer .ci-card-badge b').innerText(), answerLetter)
    await context.setOffline(false)
    await consolePage.close(); assert.equal(await button(page, 'Signal : levez vos cartes').count(), 1)
    consolePage = await openConsole(page, context, width, height)
    if (width === 1366) {
      await context.setOffline(false)
      await page.reload(); await page.locator('.ci-launch:enabled').waitFor({ timeout: 120000 })
      await consolePage.getByRole('status').filter({ hasText: 'La projection a été fermée' }).waitFor()
      assert.equal(await consolePage.locator('.ci-console-model').count(), 0)
      await page.getByRole('button', { name: /Reprendre la séance/ }).click(); await page.locator('.ci-controls').waitFor()
      await consolePage.close(); consolePage = await openConsole(page, context, width, height)
      assert.equal(await button(consolePage, 'Signal : levez vos cartes').count(), 1)
    }
    await consolePage.getByRole('combobox', { name: 'Choisir une question', exact: true }).selectOption({ value: '2' })
    await page.locator('.ci-progress').filter({ hasText: 'Question 3 / 3' }).waitFor()
    await button(consolePage, 'Passer').click()
    if (width === 1366) {
      await page.bringToFront(); await delay(250)
      assert.equal(await page.evaluate(() => document.hidden), false)
      const remaining = await page.locator('.ci-timer-value').innerText()
      await delay(1200); assert.equal(await page.locator('.ci-timer-value').innerText(), remaining)
    }
    await consolePage.getByRole('dialog', { name: 'Passer cette question ?', exact: true }).getByRole('button', { name: 'Annuler', exact: true }).click()
    if (width === 1366) {
      await page.bringToFront(); const before = await page.locator('.ci-timer-value').innerText()
      await page.waitForFunction(before => document.querySelector('.ci-timer-value')?.textContent !== before, before)
    }
    assert.equal(await page.locator('.ci-reveal').count(), 0)
    await button(consolePage, 'Terminer la séance').click()
    await consolePage.getByRole('dialog', { name: 'Terminer la séance ?', exact: true }).getByRole('button', { name: 'Terminer et voir le bilan', exact: true }).click()
    await page.locator('.ci-summary').waitFor()
    await consolePage.getByRole('status').filter({ hasText: 'Séance terminée' }).waitFor()
    assert.equal(await consolePage.locator('.ci-console-model').count(), 0)
    assert.deepEqual(consoleApi, [])
    results.push({ viewport: `${width}x${height}`, privacy: 'Full source model and private hints appear only in the teacher window before deliberate reveal.', transport: 'Commands use a local BroadcastChannel; already loaded windows remain usable offline.', authority: 'Projection reducer, lock, pause, local modal gate and human appreciation retained.', hold: 'Short keyboard hold cancels; 600 ms measured in projection; retraction hides the public model.', slots: 'Correct letter matches live projection, including remixed retry.', lifecycle: 'Closing and reopening console preserves the lesson; finished lesson disables console.', popupAndReload: width === 1366 ? 'Blocked popup has an explicit worksheet fallback; projection reload disconnects the old console and resumes durable actions.' : 'covered on desktop', accessibility: 'axe passes; projection controls and console stay within viewport', liveApiWrites: 0 })
    await context.close()
  }
  {
    const pairedRecipe = await classroomRecipe(), before = structuredClone(pairedRecipe)
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
    await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
    await context.addInitScript(() => {
      localStorage.setItem('clairfle-fiche-sync', 'teacher-console-paired-fixture-only')
      localStorage.setItem('clairfle.interactive.timer.v1', JSON.stringify({ enabled: false, seconds: 10, feedbackSeconds: 1 }))
      localStorage.setItem('clairfle.interactive.mode.v1', 'class')
    })
    await context.route('**/__test_api/fiches', route => { methods.push(route.request().method()); return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ fiches: [{ ...saved, id: 'console-paired', recipe: pairedRecipe }] }) }) })
    const page = await context.newPage(); activeProjection = page; page.on('pageerror', error => errors.push(error.message))
    await page.goto(`${base}/interactif/console-paired`); await page.locator('.ci-launch:enabled').waitFor({ timeout: 120000 })
    await button(page, 'Précharger toute la séance').click(); await page.getByRole('status').filter({ hasText: 'Prêt à jouer sans connexion' }).waitFor({ timeout: 120000 })
    await page.locator('.ci-launch').click(); await page.locator('.ci-controls').waitFor()
    const consolePage = await openConsole(page, context, 390, 844)
    const devtools = await context.newCDPSession(page)
    await devtools.send('Network.clearBrowserCache'); await devtools.detach(); await context.setOffline(true)
    await consolePage.getByRole('combobox', { name: 'Choisir une question', exact: true }).selectOption({ value: '1' })
    await page.locator('.ci-round-question').nth(1).waitFor(); await consolePage.locator('.ci-console-answer').nth(1).waitFor()
    const letters = await consolePage.locator('.ci-console-answer .ci-card-badge b').allTextContents()
    assert.match(letters[0], /^[ABC]$/); assert.match(letters[1], /^[DEF]$/)
    for (const image of await consolePage.locator('.ci-console-answer img').all()) assert.ok(await image.evaluate(async image => { await image.decode(); return image.src.startsWith('blob:') && image.naturalWidth > 0 }))
    await button(consolePage, 'Signal : levez vos cartes').click(); await button(consolePage, 'Discuter').click(); await button(consolePage, 'Enseignant : révéler').click()
    await page.locator('.ci-answer-key').nth(1).waitFor(); assert.deepEqual(await page.locator('.ci-answer-key .ci-card-badge b').allTextContents(), letters)
    await fits(page); await axe(consolePage); assert.deepEqual(pairedRecipe, before)
    results.push({ pairedAudio: 'Two source corrections retain A–C and D–F slots and match the projection.', offlinePictures: 'Future answer images decode from the projection’s prepared blob URLs after clearing the HTTP cache and cutting the network.', sourceRecipe: 'unchanged', liveApiWrites: 0 })
    await context.close()
  }
  const standalone = await browser.newPage()
  await standalone.context().addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  await standalone.goto(`${base}/interactif/console`)
  await standalone.getByRole('status').filter({ hasText: 'Ouvrez cette console depuis une séance' }).waitFor()
  assert.equal(await standalone.locator('.ci-console-model').count(), 0)
  await standalone.close()
  assert.deepEqual(errors, []); assert.ok(methods.every(method => method === 'GET')); assert.deepEqual(recipe, original)
  await writeFile('docs/interactive/teacher-console-results.json', JSON.stringify({ results, standalone: 'No source data, correction or active controller without a generated session address.', sourceRecipe: 'unchanged', apiMethods: methods, errors }, null, 2) + '\n')
  console.log(JSON.stringify(results, null, 2))
} catch (error) {
  for (const [name, page] of [['projection', activeProjection], ['console', activeConsole]]) if (page && !page.isClosed()) {
    console.error(`${name}: ${(await page.locator('body').innerText()).slice(-4500)}`)
    await page.screenshot({ path: `/tmp/clairfle-teacher-console-failure-${name}.png`, fullPage: true })
  }
  throw error
} finally { await browser.close(); await vite.close() }
