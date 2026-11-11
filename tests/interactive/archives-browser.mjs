import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'vite'
import { chromium } from 'playwright'
const base = 'http://127.0.0.1:5182'
process.env.VITE_FICHES_API_URL = `${base}/__test_api`
const server = await createServer({ cacheDir: '/tmp/clairfle-archives-vite', server: { host: '127.0.0.1', port: 5182, strictPort: true } })
await server.listen()
const recipe = JSON.parse(await readFile('docs/interactive/demo-source-recipe.json', 'utf8'))
recipe.pages = [{ ...recipe.pages[0], count: 3, numberLibre: true, numberMin: 1, numberMax: 10, numberDecimals: false }]
delete recipe.pages[0].libreItems
recipe.libreMode = false
const original = structuredClone(recipe)
const saved = { id: 'archive-template', name: 'Mes bilans de calcul', domains: ['algèbre'], recipe, createdAt: '2026-11-11T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' }
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] })
const results = [], methods = [], errors = []
const button = (page, name) => page.getByRole('button', { name, exact: true })
const row = (page, id) => page.locator(`.ci-archive-list > li[data-session-id="${id}"]`)
async function setup() {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  await context.addInitScript(() => localStorage.setItem('clairfle-fiche-sync', 'archive-fixture-only'))
  await context.route('**/__test_api/fiches', async (route) => { methods.push(route.request().method()); await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ fiches: [saved] }) }) })
  const page = await context.newPage(); page.on('pageerror', (error) => errors.push(error.message))
  await page.goto(`${base}/interactif/${saved.id}`); await ready(page)
  return { page, context }
}
async function ready(page) { await page.locator('.ci-launch:enabled').waitFor({ timeout: 120000 }); await page.locator('.ci-archives').waitFor() }
async function records(page) { return page.evaluate(async () => { const { requestLocal } = await import('/src/interactive/storage.ts'); return requestLocal('sessions', 'readonly', (store) => store.getAll()) }) }
async function finish(page) { await button(page, 'Terminer la séance').click(); await button(page, 'Terminer et voir le bilan').click(); await page.getByRole('heading', { name: 'Ce que nous avons travaillé', exact: true }).waitFor() }
async function upload(page, text) { await page.locator('.ci-import-file input').setInputFiles({ name: 'seance.json', mimeType: 'application/json', buffer: Buffer.from(text) }) }
try {
  const first = await setup(), page = first.page
  await page.locator('.ci-launch').click()
  await button(page, 'Signal : levez vos cartes').click(); await button(page, 'Discuter').click(); await button(page, 'Enseignant : révéler').click()
  await finish(page)
  const note = 'Revoir les calculs avec retenue.'
  await page.getByLabel('Observations', { exact: true }).fill(note)
  await page.getByLabel('Observations', { exact: true }).blur()
  await page.getByRole('status').filter({ hasText: 'Enregistré localement' }).waitFor()
  const [download] = await Promise.all([page.waitForEvent('download'), button(page, 'Exporter la séance').click()])
  const text = await readFile(await download.path(), 'utf8')
  const transfer = JSON.parse(text), id = transfer.session.sessionId
  assert.equal(transfer.exportVersion, 1)
  assert.equal(transfer.session.events.length, 0)
  assert.equal(transfer.session.checkpoint.state.note, note)
  assert.equal(transfer.bilan.worked, 1)
  assert.equal(transfer.bilan.skipped, 2)
  assert.ok(!text.includes('libreItems') && !text.includes('corrections'))
  await page.emulateMedia({ media: 'print' })
  assert.equal(await page.locator('.ci-summary .ci-toolbar:visible').count(), 0)
  assert.ok((await page.locator('.ci-summary-print-only').innerText()).includes(note))
  const pdf = await page.pdf({ format: 'A4', printBackground: true })
  assert.equal(pdf.subarray(0, 5).toString(), '%PDF-')
  assert.ok(pdf.length > 5000)
  await writeFile('/tmp/clairfle-archive-bilan.pdf', pdf)
  await page.emulateMedia({ media: 'screen' })
  await button(page, 'Nouvelle partie').click()
  await button(page, 'Signal : levez vos cartes').waitFor()
  const afterNewPart = await records(page)
  assert.ok(afterNewPart.some((record) => record.sessionId === id && record.checkpoint.state.finished))
  await finish(page); await button(page, 'Terminer').click(); await ready(page)
  await page.waitForFunction(() => document.querySelectorAll('.ci-archive-list > li').length === 2)
  assert.equal((await records(page)).filter((record) => record.checkpoint?.state.finished).length, 2)
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
  await page.screenshot({ path: 'docs/interactive/screenshots/archives-mobile.png', fullPage: true })
  await row(page, id).getByRole('button', { name: 'Ouvrir ce bilan', exact: true }).click()
  await page.getByRole('heading', { name: 'Ce que nous avons travaillé', exact: true }).waitFor()
  assert.equal(new URL(page.url()).searchParams.get('s'), id)
  assert.equal(await page.getByLabel('Observations', { exact: true }).inputValue(), note)
  await button(page, 'Terminer').click(); await ready(page)
  await row(page, id).getByRole('button', { name: 'Supprimer', exact: true }).click()
  await button(page, 'Annuler').click()
  assert.ok((await records(page)).some((record) => record.sessionId === id))
  results.push({ archives: 'two distinct completed parts survive New part and Finish; an older report opens with original notes', export: 'compact JSON has state, source reference and derived report without worksheet recipe or correction key', print: 'A4 PDF includes saved observations and hides commands', deletion: 'cancel preserves the selected report', mobile: 'archive controls fit without horizontal overflow' })

  // A separate browser store represents another device with access to the same server worksheet.
  const second = await setup(), target = second.page
  await upload(target, text)
  await target.getByRole('dialog', { name: 'Importer cette séance ?', exact: true }).waitFor()
  assert.equal((await records(target)).length, 0)
  await button(target, 'Annuler').click()
  assert.equal((await records(target)).length, 0)
  await upload(target, text); await button(target, 'Importer la séance').click()
  await target.getByRole('status').filter({ hasText: 'Séance importée.' }).waitFor()
  assert.equal((await records(target))[0].checkpoint.state.note, note)
  const importedBefore = JSON.stringify(await records(target))
  await upload(target, text); await button(target, 'Importer la séance').click()
  await target.getByRole('alert').filter({ hasText: 'existe déjà' }).waitFor()
  assert.equal(JSON.stringify(await records(target)), importedBefore)
  await button(target, 'Annuler').click()
  for (const [value, expected] of [
    [{ ...transfer, exportVersion: 99 }, /Version d’export/],
    [{ ...transfer, bilan: { ...transfer.bilan, worked: 999 } }, /bilan ne correspond/],
    [{ ...transfer, session: { ...transfer.session, source: { ...transfer.session.source, reference: { kind: 'saved', id: 'another-source' } } } }, /autre fiche/],
  ]) {
    await upload(target, JSON.stringify(value))
    await target.getByRole('status').filter({ hasText: expected }).waitFor()
    assert.equal(JSON.stringify(await records(target)), importedBefore)
  }
  await upload(target, ' '.repeat(2 * 1024 * 1024 + 1))
  await target.getByRole('status').filter({ hasText: /2 Mo/ }).waitFor()
  assert.equal(JSON.stringify(await records(target)), importedBefore)
  await row(target, id).getByRole('button', { name: 'Ouvrir ce bilan', exact: true }).click()
  await target.getByRole('heading', { name: 'Ce que nous avons travaillé', exact: true }).waitFor()
  assert.equal(await target.getByLabel('Observations', { exact: true }).inputValue(), note)
  await button(target, 'Revoir les questions').click()
  await button(target, 'Quitter la séance').click(); await ready(target)
  // The original page in another tab owns the same imported game, so deletion must refuse.
  const active = await second.context.newPage()
  await active.goto(target.url()); await ready(active)
  await button(active, 'Reprendre la séance').click()
  await button(active, 'Question suivante').waitFor()
  await button(target, 'Actualiser les parties').click()
  await row(target, id).getByRole('button', { name: 'Supprimer', exact: true }).click()
  await button(target, 'Confirmer la suppression').click()
  await target.getByRole('alert').filter({ hasText: /ouverte dans un autre onglet/ }).waitFor()
  assert.ok((await records(target)).some((record) => record.sessionId === id))
  await button(target, 'Annuler').click(); await active.close()
  results.push({ import: 'preview and cancel write nothing; a separate browser imports and opens the identical report', reimport: 'an existing report is never overwritten', invalidFiles: 'future schema, forged report, foreign source and more than 2 MiB rejected without writes', ownership: 'deletion while another tab owns the part is refused' })

  await row(page, id).getByRole('button', { name: 'Supprimer', exact: true }).click()
  await button(page, 'Confirmer la suppression').click()
  await page.getByRole('status').filter({ hasText: 'Partie supprimée' }).waitFor()
  assert.ok(!(await records(page)).some((record) => record.sessionId === id))
  assert.equal((await records(page)).length, 1)
  await page.getByText('Données locales du jeu', { exact: true }).click()
  await button(page, 'Effacer les données locales du jeu').click()
  await button(page, 'Annuler').click()
  assert.equal((await records(page)).length, 1)
  await page.evaluate(async () => { const { requestLocal } = await import('/src/interactive/storage.ts'); await requestLocal('settings', 'readwrite', (store) => store.put({ id: 'future-setting', schemaVersion: 99 })); localStorage.setItem('clairfle.interactive.mascot.v1', '"owl"'); localStorage.setItem('unrelated-fixture', 'keep') })
  await button(page, 'Effacer les données locales du jeu').click()
  await button(page, 'Confirmer l’effacement').click()
  await page.waitForURL('**/generateur')
  const remaining = await page.evaluate(async () => { const { openInteractiveDatabase } = await import('/src/interactive/storage.ts'); const db = await openInteractiveDatabase(); const sizes = {}; for (const name of db.objectStoreNames) sizes[name] = await new Promise((resolve) => { const request = db.transaction(name).objectStore(name).count(); request.onsuccess = () => resolve(request.result) }); return { sizes, staleFlag: localStorage.getItem('clairfle.interactive.mascot.v1'), other: localStorage.getItem('unrelated-fixture'), authKept: localStorage.getItem('clairfle-fiche-sync') } })
  assert.ok(Object.values(remaining.sizes).every((size) => size === 0))
  assert.equal(remaining.staleFlag, null)
  assert.equal(remaining.other, 'keep')
  assert.equal(remaining.authKept, 'archive-fixture-only')
  assert.deepEqual(recipe, original)
  assert.ok(methods.every((method) => method === 'GET'))
  assert.deepEqual(errors, [])
  results.push({ erase: 'cancel preserves data; explicit confirmation clears all interactive stores including future settings and old interactive flags, while preserving unrelated data and access', serverWrites: 0 })
  await writeFile('docs/interactive/archives-results.json', JSON.stringify(results, null, 2) + '\n')
  console.log(JSON.stringify(results, null, 2))
} finally { await browser.close(); await server.close() }
