import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { readFile, writeFile } from 'node:fs/promises'
import { classroomRecipe } from './classroom-fixture.mjs'
const base = process.env.INTERACTIVE_TEST_URL ?? 'http://127.0.0.1:5180'
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] })
try {
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } })
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.context().addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  await page.goto(`${base}/interactif/demo`)
  await page.getByRole('button', { name: /Commencer la séance/ }).waitFor({ timeout: 120000 })
  await page.evaluate((recipe) => { history.pushState({ clairfleInteractive: { recipe, name: 'Séance enseignant' } }, '', '/interactif'); dispatchEvent(new PopStateEvent('popstate')) }, await classroomRecipe())
  await page.getByRole('button', { name: 'Télécharger la feuille enseignant', exact: true }).waitFor()
  assert.equal(await page.locator('.ci-app table[data-plan-id]').count(), 0)
  assert.equal(await page.locator('.ci-reveal').count(), 0)
  const downloadEvent = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Télécharger la feuille enseignant', exact: true }).click()
  const download = await downloadEvent
  assert.equal(download.suggestedFilename(), 'clairfle-enseignant.html')
  await download.saveAs('/tmp/clairfle-enseignant.html')
  const html = await readFile('/tmp/clairfle-enseignant.html', 'utf8')
  const printPage = await browser.newPage()
  const external = []
  printPage.on('request', (request) => { if (request.url().startsWith('http')) external.push(request.url()) })
  await printPage.setContent(html)
  assert.match(await printPage.locator('body').innerText(), /ENSEIGNANT — NE PAS PROJETER/)
  assert.equal(await printPage.locator('tbody tr').count(), 3)
  assert.equal(await printPage.locator('tbody img').count(), 3)
  await printPage.waitForFunction(() => [...document.images].every((image) => image.complete && image.naturalWidth > 0))
  const planId = await printPage.locator('table').getAttribute('data-plan-id')
  assert.match(planId, /^[a-f0-9]{64}$/)
  const paperLetters = await printPage.locator('.card > b').allTextContents()
  assert.ok(['A', 'B', 'C'].includes(paperLetters[1]))
  assert.ok(['D', 'E', 'F'].includes(paperLetters[2]))
  assert.deepEqual(external, [])
  await printPage.emulateMedia({ media: 'print' })
  const pdf = await printPage.pdf({ path: '/tmp/clairfle-enseignant.pdf', preferCSSPageSize: true, printBackground: true })
  const boxes = [...pdf.toString('latin1').matchAll(/MediaBox\s*\[\s*0\s+0\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s*\]/g)]
  assert.ok(boxes.length > 0)
  for (const box of boxes) { assert.ok(Math.abs(Number(box[1]) - 595) < 2); assert.ok(Math.abs(Number(box[2]) - 842) < 2) }
  await page.getByRole('button', { name: /Commencer la séance/ }).click()
  await page.locator('.ci-controls').waitFor()
  assert.equal(await page.locator('.ci-reveal').count(), 0)
  await page.getByRole('button', { name: 'Quitter la séance', exact: true }).click()
  await page.getByRole('button', { name: /Reprendre la séance/ }).waitFor()
  const stored = await page.evaluate(async () => {
    const db = await new Promise((resolve) => { const request = indexedDB.open('clairfle-interactive'); request.onsuccess = () => resolve(request.result) })
    const rows = await new Promise((resolve) => { const request = db.transaction('sessions').objectStore('sessions').getAll(); request.onsuccess = () => resolve(request.result) })
    db.close(); return rows.map((row) => row.planId)
  })
  assert.ok(stored.includes(planId))
  await page.locator('.ci-question-list fieldset > label input').first().uncheck()
  await page.locator('.ci-teacher-sheet [role="status"]').filter({ hasText: 'obsolète' }).waitFor()
  assert.deepEqual(errors, [])
  const results = { questions: 3, pairedSlots: paperLetters.slice(1), samePlanAsSession: true, embeddedImages: 3, externalRequestsInPrint: 0, paper: 'A4 portrait', sourceChanged: 'obsolete sheet warning', projection: 'no answer sheet DOM before or after download', errors }
  await writeFile('docs/interactive/teacher-sheet-results.json', JSON.stringify(results, null, 2) + '\n')
  console.log(JSON.stringify(results, null, 2))
} finally { await browser.close() }
