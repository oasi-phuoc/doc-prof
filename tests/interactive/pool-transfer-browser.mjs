import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { chromium } from 'playwright'
import { createServer } from 'vite'
import { gameControl } from './browser-actions.mjs'

const base = 'http://127.0.0.1:5182'
const server = await createServer({ server: { host: '127.0.0.1', port: 5182, strictPort: true, hmr: false } })
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] })
const button = (scope, name) => scope.getByRole('button', { name, exact: typeof name === 'string' })

async function openPoolHome() {
  const context = await browser.newContext({ viewport: { width: 1200, height: 800 }, acceptDownloads: true })
  await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  const page = await context.newPage()
  page.setDefaultTimeout(30_000)
  await page.goto(`${base}/interactif`)
  await page.getByRole('heading', { name: 'On joue ?', exact: true }).waitFor({ timeout: 120_000 })
  return { context, page }
}

async function startImport(page) {
  await button(page, /^Contenu/).click()
  await button(page, 'Importer une séance').click()
  return page.getByRole('dialog', { name: 'Importer une séance', exact: true })
}

const upload = (dialog, buffer) => dialog.getByLabel('Fichier de séance').setInputFiles({ name: 'pool.json', mimeType: 'application/json', buffer })

async function localCounts(page) {
  return page.evaluate(async () => {
    const { requestLocal } = await import('/src/interactive/storage.ts')
    return Promise.all(['pools', 'sessions'].map(name => requestLocal(name, 'readonly', store => store.count())))
  })
}

try {
  await server.listen()
  const origin = await openPoolHome()
  await button(origin.page, /^Contenu/).click()
  await origin.page.getByRole('combobox', { name: 'Domaine des exercices' }).selectOption('algèbre')
  await origin.page.locator('input[data-pool-type="addition-ligne"]').check()
  await button(origin.page, 'Préparer la partie').click()
  await origin.page.waitForURL(url => url.searchParams.has('pool'))
  await origin.page.locator('.ci-launch:enabled').click()
  await origin.page.locator('.ci-answer').first().waitFor()
  const question = await origin.page.locator('.ci-question-prompt').innerText()
  for (const label of ['Signal : levez vos cartes', 'Discuter', 'Enseignant : révéler', 'Terminer la séance', 'Terminer et voir le bilan']) await gameControl(origin.page, label).click()
  await origin.page.getByRole('heading', { name: 'Ce que nous avons travaillé' }).waitFor()
  await origin.page.getByRole('textbox', { name: 'Observations', exact: true }).fill('Reprendre les additions demain.')
  await origin.page.getByRole('textbox', { name: 'Observations', exact: true }).blur()
  const downloaded = origin.page.waitForEvent('download')
  await button(origin.page, 'Exporter avec le pool').click()
  const exportFile = await downloaded
  assert.match(exportFile.suggestedFilename(), /^clairfle-pool-seance-/)
  const data = await readFile(await exportFile.path())
  const transfer = JSON.parse(data.toString())
  assert.equal(transfer.format, 'clairfle-pool-session')
  assert.equal(transfer.pool.poolId, new URL(origin.page.url()).searchParams.get('pool'))
  await origin.context.close()

  const target = await openPoolHome()
  assert.deepEqual(await localCounts(target.page), [0, 0])
  const dialog = await startImport(target.page)
  const invalid = Buffer.from(JSON.stringify({ ...transfer, pool: { ...transfer.pool, seed: (transfer.pool.seed + 1) >>> 0 } }))
  await upload(dialog, invalid)
  await dialog.getByRole('alert').waitFor()
  assert.deepEqual(await localCounts(target.page), [0, 0])
  await upload(dialog, data)
  await dialog.getByRole('heading', { name: transfer.pool.name, exact: true }).waitFor()
  assert.deepEqual(await localCounts(target.page), [0, 0])
  await target.page.evaluate(async pool => {
    const { requestLocal } = await import('/src/interactive/storage.ts')
    await requestLocal('pools', 'readwrite', store => store.add({ ...pool, name: 'Pool déjà présent' }))
  }, transfer.pool)
  await button(dialog, 'Importer et ouvrir').click()
  await dialog.getByRole('alert').filter({ hasText: 'Un pool différent' }).waitFor()
  assert.deepEqual(await localCounts(target.page), [1, 0])
  assert.equal(await target.page.evaluate(async id => {
    const { loadPool } = await import('/src/interactive/pools/storage.ts')
    return (await loadPool(id)).name
  }, transfer.pool.poolId), 'Pool déjà présent')
  await target.page.evaluate(async id => {
    const { requestLocal } = await import('/src/interactive/storage.ts')
    await requestLocal('pools', 'readwrite', store => store.delete(id))
  }, transfer.pool.poolId)
  await button(dialog, 'Importer et ouvrir').click()
  await target.page.waitForURL(url => url.searchParams.get('s') === transfer.run.session.sessionId)
  await target.page.getByRole('heading', { name: 'Ce que nous avons travaillé' }).waitFor()
  assert.equal(await target.page.getByRole('textbox', { name: 'Observations', exact: true }).inputValue(), 'Reprendre les additions demain.')
  assert.ok(await target.page.locator('.ci-summary-questions').getByText(question, { exact: true }).count())
  assert.deepEqual(await localCounts(target.page), [1, 1])
  await target.page.goto(`${base}/interactif`)
  const duplicate = await startImport(target.page)
  await upload(duplicate, data)
  await button(duplicate, 'Importer et ouvrir').click()
  await duplicate.getByRole('alert').filter({ hasText: 'existe déjà' }).waitFor()
  assert.deepEqual(await localCounts(target.page), [1, 1])
  await target.context.close()
  console.log('Pool et bilan transférés dans un navigateur vierge. Fichier modifié, pool en conflit et doublon refusés.')
} finally {
  await browser.close()
  await server.close()
}
