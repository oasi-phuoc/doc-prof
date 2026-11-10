import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'
const base = process.env.INTERACTIVE_TEST_URL ?? 'http://127.0.0.1:5180'
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] })
try {
  const page = await browser.newPage()
  await page.context().addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  await page.goto(`${base}/interactif/demo`)
  await page.locator('.ci-launch:enabled').waitFor({ timeout: 120000 })
  const result = await page.evaluate(async () => {
    const { purgeExpiredSessions, newRecord, saveSession } = await import('/src/interactive/domain/persistence.ts')
    const game = { id: 'retention-fixture', title: 'Test', questions: [{ id: 'q1', mode: 'choice', choices: [{ id: 'a', text: 'Un' }, { id: 'b', text: 'Deux' }], images: [], prompt: 'Question' }], corrections: { q1: { choiceId: 'b', text: 'Deux' } }, issues: [] }
    const record = await newRecord(game)
    const now = Date.now()
    const expiredAt = now - 8 * 24 * 60 * 60 * 1000
    const records = [
      { ...record, gameId: 'expired-schema-1', schemaVersion: 1, updatedAt: expiredAt },
      { ...record, gameId: 'expired-schema-2', schemaVersion: 2, updatedAt: expiredAt },
      { ...record, gameId: 'recent', updatedAt: now },
      { ...record, gameId: 'future-schema', schemaVersion: 3, updatedAt: expiredAt },
      { ...record, gameId: 'invalid-date', updatedAt: 'unknown' },
    ]
    const db = await new Promise((resolve) => { const request = indexedDB.open('clairfle-interactive', 1); request.onsuccess = () => resolve(request.result) })
    await new Promise((resolve) => { const tx = db.transaction('sessions', 'readwrite'); for (const record of records) tx.objectStore('sessions').put(record); tx.oncomplete = resolve })
    const removed = await purgeExpiredSessions(now)
    const remaining = await new Promise((resolve) => { const request = db.transaction('sessions').objectStore('sessions').getAll(); request.onsuccess = () => resolve(request.result) })
    let staleWrite = ''
    try { await saveSession({ ...records[1], updatedAt: now }, records[1]) } catch (error) { staleWrite = error.message }
    db.close()
    return { removed, ids: remaining.map((record) => record.gameId).sort(), futureUnchanged: JSON.stringify(remaining.find((record) => record.gameId === 'future-schema')) === JSON.stringify(records[3]), staleWrite }
  })
  assert.equal(result.removed, 2)
  assert.deepEqual(result.ids, ['future-schema', 'invalid-date', 'recent'])
  assert.equal(result.futureUnchanged, true)
  assert.match(result.staleWrite, /modifiée dans une autre fenêtre/)
  await page.reload()
  await page.locator('.ci-launch:enabled').waitFor()
  await page.locator('.ci-launch').click()
  await page.getByRole('button', { name: 'Signal : levez vos cartes', exact: true }).waitFor()
  const report = { retention: 'expired schema 1 and 2 sessions purged after seven days', preserved: 'recent sessions, unknown schemas and unverifiable dates', futureSchemaUnchanged: result.futureUnchanged, staleWriter: 'cannot recreate a purged journal', playAfterCleanup: 'passed' }
  await writeFile('docs/interactive/retention-results.json', JSON.stringify(report, null, 2) + '\n')
  console.log(JSON.stringify(report, null, 2))
} finally { await browser.close() }
