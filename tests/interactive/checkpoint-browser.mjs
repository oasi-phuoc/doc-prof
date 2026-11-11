import { skipQuestion } from './browser-actions.mjs'
import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { writeFile } from 'node:fs/promises'
const base = process.env.INTERACTIVE_TEST_URL ?? 'http://127.0.0.1:5180'
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] })
async function storedRecord(page, gameId) {
  return page.evaluate(async (id) => {
    const db = await new Promise((resolve) => { const request = indexedDB.open('clairfle-interactive'); request.onsuccess = () => resolve(request.result) })
    const record = await new Promise((resolve) => { const request = db.transaction('sessions').objectStore('sessions').get(id); request.onsuccess = () => resolve(request.result) })
    db.close()
    return record
  }, gameId)
}
async function waitCheckpoint(page, gameId, predicate) {
  for (let attempt = 0; attempt < 150; attempt++) {
    const record = await storedRecord(page, gameId)
    if (record?.checkpoint && predicate(record)) return record
    await new Promise((resolve) => setTimeout(resolve, 20))
  }
  assert.fail('Expected durable checkpoint was not written')
}
try {
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.context().addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  await page.goto(`${base}/interactif/demo`)
  await page.locator('.ci-launch:enabled').waitFor({ timeout: 120000 })
  const fixture = await page.evaluate(async () => {
    const { demoRecipe } = await import('/src/interactive/demo.ts')
    const { convertRecipe } = await import('/src/interactive/domain/convert.ts')
    const { prepareGame } = await import('/src/interactive/domain/plan.ts')
    const { newRecord } = await import('/src/interactive/domain/persistence.ts')
    const game = prepareGame(convertRecipe(demoRecipe(), 'Les cartes de la classe'))
    const record = await newRecord(game)
    record.schemaVersion = 1
    delete record.revision
    record.events = Array.from({ length: 4998 }, (_, index) => ({ eventId: `legacy-${index}`, at: Date.now(), action: { type: index % 2 === 0 ? 'PAUSE' : 'RESUME' } }))
    record.events.push({ eventId: 'legacy-cards-up', at: Date.now(), action: { type: 'CARDS_UP' } })
    const db = await new Promise((resolve) => { const request = indexedDB.open('clairfle-interactive'); request.onsuccess = () => resolve(request.result) })
    await new Promise((resolve) => { const transaction = db.transaction('sessions', 'readwrite'); transaction.objectStore('sessions').put(record); transaction.oncomplete = resolve })
    db.close()
    return { gameId: game.id, beforeBytes: JSON.stringify(record).length, questions: game.questions.length }
  })
  await page.locator('.ci-launch').click()
  await page.getByRole('button', { name: 'Discuter', exact: true }).waitFor()
  assert.equal(await page.locator('.ci-reveal').count(), 0)
  await page.getByRole('button', { name: 'Discuter', exact: true }).click()
  const running = await waitCheckpoint(page, fixture.gameId, (record) => record.checkpoint.state.phase === 'discussion')
  assert.equal(running.schemaVersion, 5)
  assert.equal(running.events.length, 0)
  assert.equal(running.checkpoint.state.finished, false)
  assert.ok(JSON.stringify(running).length < fixture.beforeBytes / 10)
  assert.ok(!JSON.stringify(running).includes('788 + 771'))
  await page.reload()
  await page.getByRole('button', { name: /Reprendre la séance/ }).click()
  await page.getByRole('button', { name: 'Enseignant : révéler', exact: true }).waitFor()
  assert.equal(await page.locator('.ci-reveal').count(), 0)
  await page.getByRole('button', { name: 'Enseignant : révéler', exact: true }).click()
  await page.locator('.ci-reveal').waitFor()
  await page.getByRole('button', { name: 'Question suivante', exact: true }).click()
  while (await page.getByRole('button', { name: 'Passer', exact: true }).count()) await skipQuestion(page)
  await page.locator('.ci-summary').waitFor()
  await page.getByRole('textbox', { name: 'Observations', exact: true }).fill('Reprendre les retenues au prochain cours.')
  await page.getByRole('textbox', { name: 'Observations', exact: true }).blur()
  const finished = await waitCheckpoint(page, fixture.gameId, (record) => record.checkpoint.state.finished && record.checkpoint.state.note === 'Reprendre les retenues au prochain cours.')
  assert.equal(finished.events.length, 0)
  assert.equal(finished.checkpoint.state.history.length, fixture.questions)
  await page.reload()
  await page.getByRole('button', { name: 'Revoir le bilan', exact: true }).click()
  await page.locator('.ci-summary').waitFor()
  assert.equal(await page.getByRole('textbox', { name: 'Observations', exact: true }).inputValue(), finished.checkpoint.state.note)
  assert.equal(await page.locator('.ci-summary-questions > p').count(), fixture.questions)
  assert.deepEqual(errors, [])
  const result = { migration: 'schema 1–3 readable; new writes upgrade to schema 4', boundary: '5000 accepted actions compact into a resumable discussion, no reveal', beforeBytes: fixture.beforeBytes, compactedBytes: JSON.stringify(running).length, summary: 'finished checkpoint retains all attempts and later observations after reload', noAnswerKey: 'no source text or answer sheet in checkpoint', errors }
  await writeFile('docs/interactive/checkpoint-results.json', JSON.stringify(result, null, 2) + '\n')
  console.log(JSON.stringify(result, null, 2))
} finally { await browser.close() }
