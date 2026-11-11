import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'vite'
import { chromium } from 'playwright'
const base = 'http://127.0.0.1:5182'
process.env.VITE_FICHES_API_URL = `${base}/__test_api`
const server = await createServer({ cacheDir: '/tmp/clairfle-presets-vite', server: { host: '127.0.0.1', port: 5182, strictPort: true } })
await server.listen()
const recipe = JSON.parse(await readFile('docs/interactive/demo-source-recipe.json', 'utf8'))
recipe.pages = [{ ...recipe.pages[0], count: 5, numberLibre: true, numberMin: 1, numberMax: 10, numberDecimals: false }]
delete recipe.pages[0].libreItems
recipe.libreMode = false
const original = structuredClone(recipe)
const saved = { id: 'preset-template', name: 'Ma fiche de calcul', domains: ['algèbre'], recipe, createdAt: '2026-11-11T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' }
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] })
const results = []
const button = (page, name) => page.getByRole('button', { name, exact: true })
async function rows(page) { return page.evaluate(async () => { const { requestLocal } = await import('/src/interactive/storage.ts'); return requestLocal('presets-local', 'readonly', (store) => store.getAll()) }) }
async function ready(page, url = `${base}/interactif/${saved.id}`) { await page.goto(url); await page.locator('.ci-launch:enabled').waitFor({ timeout: 120000 }); await page.locator('.ci-presets').waitFor() }
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  await context.addInitScript(() => localStorage.setItem('clairfle-fiche-sync', 'preset-fixture-only'))
  const methods = []
  await context.route('**/__test_api/fiches', async (route) => { methods.push(route.request().method()); await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ fiches: [saved] }) }) })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await ready(page)
  const list = page.locator('.ci-question-list fieldset > label')
  const lastPrompt = (await list.last().locator('b').innerText()).replace(/^\d+\.\s*/, '')
  await button(page, 'Tout désélectionner').click()
  await list.first().locator('input').check()
  await list.last().locator('input').check()
  await page.getByLabel('Ordre des questions', { exact: true }).selectOption('custom')
  await button(page, 'Descendre la question 1').click()
  await page.getByLabel('Nombre maximal de choix', { exact: true }).selectOption('3')
  await page.getByRole('checkbox', { name: 'Ranger les nombres par ordre croissant', exact: true }).check()
  await page.getByRole('spinbutton', { name: 'Temps de réflexion (secondes)', exact: true }).fill('15')
  await button(page, 'Régler le minuteur').click()
  await page.getByRole('spinbutton', { name: 'Temps entre les questions (secondes)', exact: true }).fill('3')
  await button(page, 'Fermer les réglages').click()
  await button(page, 'Mode de jeu').click()
  await page.getByLabel('Nom du préréglage', { exact: true }).fill('Calcul ciblé')
  await button(page, 'Enregistrer le préréglage').click()
  await page.getByRole('status').filter({ hasText: 'Préréglage enregistré sur cet appareil.' }).waitFor()
  const stored = (await rows(page))[0]
  assert.equal(stored.version, 2)
  assert.equal(stored.selectedQuestionIds.length, 2)
  assert.equal(stored.playMode, 'solo')
  assert.equal(stored.maxChoices, 3)
  assert.equal(stored.numericOrder, true)
  await page.locator('.ci-launch:enabled').click()
  await page.locator('.ci-solo-session .ci-controls').waitFor()
  await page.waitForURL('**?s=*')
  const sessionUrl = page.url()
  assert.equal(await page.locator('.ci-question-prompt').innerText(), lastPrompt)
  assert.equal(await page.locator('.ci-answer').count(), 3)
  const values = (await page.locator('.ci-answer-content > span').allTextContents()).map((value) => Number(value.replace(/\s/g, '')))
  assert.deepEqual(values, [...values].sort((a, b) => a - b))
  await page.locator('.ci-answer').first().click()
  await page.locator('.ci-reveal').waitFor()
  await button(page, 'Pause').click()
  await button(page, 'Quitter la séance').click()
  await page.getByRole('button', { name: /Reprendre la séance/ }).waitFor()
  await button(page, 'Supprimer le préréglage').click()
  const deletion = page.getByRole('dialog', { name: 'Supprimer ce préréglage ?', exact: true })
  await deletion.getByRole('button', { name: 'Annuler', exact: true }).click()
  assert.equal((await rows(page)).length, 1)
  await button(page, 'Supprimer le préréglage').click()
  await deletion.getByRole('button', { name: 'Confirmer la suppression', exact: true }).click()
  await page.getByRole('status').filter({ hasText: 'Préréglage supprimé.' }).waitFor()
  assert.equal((await rows(page)).length, 0)
  await page.close()
  results.push({ preset: 'version 2 stores two selected positions, custom order, three choices, numeric order, Solo and timing', launch: 'custom first question and ascending source choices applied; server template unchanged', deletion: 'cancel preserves the preset; explicit confirmation removes it' })

  const restored = await context.newPage()
  await ready(restored, sessionUrl)
  await restored.getByRole('button', { name: /Reprendre la séance/ }).click()
  await restored.locator('.ci-pause').waitFor()
  assert.equal(await restored.locator('.ci-answer').count(), 3)
  assert.equal(await restored.locator('.ci-question-prompt').innerText(), lastPrompt)
  await button(restored, 'Quitter la séance').click()
  await restored.getByRole('button', { name: /Reprendre la séance/ }).waitFor()
  await restored.getByLabel('Nom du préréglage', { exact: true }).fill('Obsolète')
  await button(restored, 'Enregistrer le préréglage').click()
  await restored.getByRole('status').filter({ hasText: 'Préréglage enregistré sur cet appareil.' }).waitFor()
  const old = (await rows(restored))[0]
  await restored.close()
  results.push({ durablePlan: 'session resumes exact custom order and choice limit after original preset is deleted and original tab closed' })

  recipe.pages[0].count = 3
  const edited = await context.newPage()
  await ready(edited)
  const presets = edited.getByLabel('Préréglages enregistrés', { exact: true })
  await presets.selectOption(old.presetId)
  await button(edited, 'Charger le préréglage').click()
  const stale = edited.getByRole('dialog', { name: 'La fiche a changé', exact: true })
  await stale.waitFor()
  assert.match(await stale.innerText(), /1 question\(s\) ne sont plus disponibles/)
  await stale.getByRole('button', { name: 'Ignorer ce préréglage', exact: true }).click()
  assert.deepEqual((await rows(edited)).find((row) => row.presetId === old.presetId), old)
  await button(edited, 'Charger le préréglage').click()
  await stale.getByRole('button', { name: 'Dupliquer et adapter', exact: true }).click()
  await edited.getByRole('status').filter({ hasText: 'Préréglage adapté à la fiche actuelle.' }).waitFor()
  const copied = (await rows(edited)).find((row) => row.presetId !== old.presetId)
  assert.equal(copied.selectedQuestionIds.length, 1)
  assert.notEqual(copied.contentHashAtSave, old.contentHashAtSave)
  assert.deepEqual((await rows(edited)).find((row) => row.presetId === old.presetId), old)
  await presets.selectOption(old.presetId)
  await button(edited, 'Charger le préréglage').click()
  await stale.getByRole('button', { name: 'Mettre à jour', exact: true }).click()
  await edited.getByRole('status').filter({ hasText: 'Préréglage adapté à la fiche actuelle.' }).waitFor()
  const updated = (await rows(edited)).find((row) => row.presetId === old.presetId)
  assert.equal(updated.revision, 1)
  assert.equal(updated.selectedQuestionIds.length, 1)
  results.push({ stalePreset: 'source edit warned; ignore leaves data untouched; duplicate preserves original; update retains available source positions and increments revision' })

  const concurrency = await edited.evaluate(async (previous) => {
    const { saveLocalPreset, deleteLocalPreset, presetOptions, listLocalPresets } = await import('/src/interactive/presets.ts')
    const { requestLocal } = await import('/src/interactive/storage.ts')
    const input = { sourceKey: previous.sourceKey, contentHashAtSave: previous.contentHashAtSave, name: 'Modification', selectedQuestionIds: previous.selectedQuestionIds, options: presetOptions(previous), timer: { enabled: previous.timer.enabled, seconds: previous.timer.defaultSec, feedbackSeconds: previous.timer.feedbackSec }, playMode: previous.playMode }
    const attempts = await Promise.allSettled([saveLocalPreset(input, previous), saveLocalPreset({ ...input, name: 'Autre modification' }, previous)])
    let staleDelete = ''
    try { await deleteLocalPreset(previous) } catch (error) { staleDelete = error.message }
    const future = { ...previous, presetId: crypto.randomUUID(), version: 99, name: 'Version future' }
    await requestLocal('presets-local', 'readwrite', (store) => store.put(future))
    const listed = await listLocalPresets(previous.sourceKey)
    const retained = await requestLocal('presets-local', 'readonly', (store) => store.get(future.presetId))
    return { successes: attempts.filter((entry) => entry.status === 'fulfilled').length, staleDelete, unavailable: listed.unavailable, futureUnchanged: JSON.stringify(future) === JSON.stringify(retained) }
  }, updated)
  assert.equal(concurrency.successes, 1)
  assert.match(concurrency.staleDelete, /autre onglet/)
  assert.equal(concurrency.unavailable, 1)
  assert.equal(concurrency.futureUnchanged, true)
  await button(edited, 'Actualiser la liste').click()
  await edited.getByRole('status').filter({ hasText: /1 préréglage\(s\) indisponible/ }).waitFor()
  await edited.locator('.ci-presets').screenshot({ path: 'docs/interactive/screenshots/presets-mobile.png' })
  assert.deepEqual(errors, [])
  assert.ok(methods.every((method) => method === 'GET'))
  recipe.pages[0].count = original.pages[0].count
  assert.deepEqual(recipe, original)
  results.push({ concurrency: 'one atomic update wins; stale deletion rejected', futureSchema: 'unknown preset reported and preserved', serverWrites: 0 })
  await edited.close()
  await writeFile('docs/interactive/presets-results.json', JSON.stringify(results, null, 2) + '\n')
  console.log(JSON.stringify(results, null, 2))
} finally { await browser.close(); await server.close() }
