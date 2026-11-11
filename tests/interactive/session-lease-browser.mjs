import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { writeFile } from 'node:fs/promises'
const base = process.env.INTERACTIVE_TEST_URL ?? 'http://127.0.0.1:5180'
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] })
const results = []
async function prepare(context) {
  const page = await context.newPage()
  await page.goto(`${base}/interactif/demo`)
  await page.locator('.ci-launch:enabled').waitFor({ timeout: 120000 })
  return page
}
try {
  for (const backend of ['locks', 'channel']) {
    const context = await browser.newContext({ viewport: { width: 390, height: 700 } })
    await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
    if (backend === 'channel') await context.addInitScript(() => Object.defineProperty(navigator, 'locks', { value: undefined }))
    const errors = []
    context.on('page', (page) => page.on('pageerror', (error) => errors.push(error.message)))
    const first = await prepare(context)
    await first.locator('.ci-launch').click()
    await first.getByRole('button', { name: 'Signal : levez vos cartes', exact: true }).click()
    await first.getByRole('button', { name: 'Compter', exact: true }).click()
    const panel = first.getByRole('dialog', { name: 'Comptage saisi par l’enseignant', exact: true })
    await panel.getByRole('spinbutton', { name: 'Nombre de votes, carte A', exact: true }).fill('2')
    await panel.getByRole('checkbox', { name: 'Montrer à la classe', exact: true }).check()
    await panel.getByRole('button', { name: 'Valider le comptage', exact: true }).click()
    const second = await prepare(context)
    await second.getByRole('button', { name: 'Supprimer la sauvegarde', exact: true }).click()
    await second.getByText(/La sauvegarde ne peut pas être effacée/).waitFor()
    assert.equal(await first.getByRole('button', { name: 'Discuter', exact: true }).isVisible(), true)
    await second.locator('.ci-launch').click()
    await second.getByRole('heading', { name: 'Séance ouverte dans un autre onglet', exact: true }).waitFor()
    assert.equal(await second.locator('.ci-answer').count(), 0)
    await second.getByRole('button', { name: 'Prendre la main', exact: true }).click()
    await second.getByRole('button', { name: 'Discuter', exact: true }).waitFor()
    await first.locator('.ci-session-busy').waitFor()
    assert.match(await second.locator('.ci-manual-vote').innerText(), /A : 2/)
    assert.equal(await second.locator('.ci-reveal').count(), 0)
    assert.equal(await first.locator('.ci-answer').count(), 0)
    await second.getByRole('button', { name: 'Discuter', exact: true }).click()
    await second.getByRole('button', { name: 'Enseignant : révéler', exact: true }).click()
    await first.getByRole('button', { name: 'Réessayer', exact: true }).click()
    await first.locator('.ci-session-busy').waitFor()
    await second.getByRole('button', { name: 'Quitter la séance', exact: true }).click()
    await second.getByRole('button', { name: /Reprendre la séance/ }).waitFor()
    await first.getByRole('button', { name: 'Réessayer', exact: true }).click()
    await first.locator('.ci-reveal').waitFor()
    assert.match(await first.locator('.ci-manual-vote').innerText(), /A : 2/)
    assert.equal(await first.locator('.ci-correction-status').count(), 0)
    assert.deepEqual(errors, [])
    results.push({ backend, concurrentOpen: 'second window blocks before controls mount', takeover: 'owner drains its journal before handoff', preserved: 'cards-up, manual counts and later teacher reveal', errors })
    await context.close()
  }
  const race = await browser.newContext()
  await race.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  await race.addInitScript(() => Object.defineProperty(navigator, 'locks', { value: undefined }))
  const pages = await Promise.all([prepare(race), prepare(race)])
  await Promise.all(pages.map((page) => page.locator('.ci-launch').click()))
  await Promise.all(pages.map((page) => page.locator('.ci-controls, .ci-session-busy').waitFor()))
  assert.equal((await Promise.all(pages.map((page) => page.locator('.ci-controls').count()))).reduce((a, b) => a + b, 0), 1)
  results.push({ fallbackRace: 'simultaneous claims elect exactly one writer' })
  await race.close()
  const unavailable = await browser.newContext()
  await unavailable.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  await unavailable.addInitScript(() => { Object.defineProperty(navigator, 'locks', { value: undefined }); window.BroadcastChannel = undefined })
  const page = await prepare(unavailable)
  await page.locator('.ci-launch').click()
  await page.locator('.ci-controls').waitFor()
  assert.match(await page.locator('.ci-notice').innerText(), /sans reprise automatique/)
  await page.getByRole('button', { name: 'Signal : levez vos cartes', exact: true }).click()
  await page.getByRole('button', { name: 'Discuter', exact: true }).waitFor()
  const records = await page.evaluate(async () => {
    const db = await new Promise((resolve) => { const request = indexedDB.open('clairfle-interactive'); request.onsuccess = () => resolve(request.result) })
    const rows = await new Promise((resolve) => { const request = db.transaction('sessions').objectStore('sessions').getAll(); request.onsuccess = () => resolve(request.result) })
    db.close()
    return rows.length
  })
  assert.equal(records, 0)
  results.push({ unavailableAPIs: 'play continues with explicit no-resume message and no journal writes' })
  const atomic = await browser.newPage()
  await atomic.context().addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  await atomic.goto(`${base}/interactif/demo`)
  await atomic.locator('.ci-launch:enabled').waitFor({ timeout: 120000 })
  const protection = await atomic.evaluate(async () => {
    const { saveSession, loadSession, newRecord, deleteSession } = await import('/src/interactive/domain/persistence.ts')
    const game = { id: 'atomic-storage-fixture', title: 'Test', questions: [{ id: 'q1', mode: 'choice', choices: [{ id: 'a', text: 'Un' }, { id: 'b', text: 'Deux' }], images: [], prompt: 'Question' }], corrections: { q1: { choiceId: 'b', text: 'Deux' } }, issues: [] }
    const original = await saveSession(await newRecord(game))
    const latest = await saveSession({ ...original, events: [{ eventId: 'newest-vote', at: Date.now(), action: { type: 'CARDS_UP' } }] }, original)
    const failures = []
    for (const write of [() => saveSession({ ...original, updatedAt: Date.now(), clock: { roundId: 'q1', phase: 'thinking', durationMs: 30000, remainingMs: 29000 } }, original), () => deleteSession(game, original), () => saveSession({ ...original, sessionId: 'another-session' })]) {
      try { await write(); failures.push('unexpected success') } catch (error) { failures.push(error.message) }
    }
    const restored = await loadSession(game)
    const beforeRace = restored.record
    const writers = await Promise.allSettled([saveSession({ ...beforeRace, updatedAt: Date.now() }, beforeRace), saveSession({ ...beforeRace, updatedAt: Date.now() }, beforeRace)])
    const afterRace = await loadSession(game)
    const summary = { failures, revision: latest.revision, phase: restored.state.phase, lastEvent: restored.record.events.at(-1).eventId, successfulConcurrentWriters: writers.filter((writer) => writer.status === 'fulfilled').length, finalRevision: afterRace.record.revision }
    await deleteSession(game, afterRace.record)
    return summary
  })
  assert.equal(protection.revision, 1)
  assert.equal(protection.phase, 'cards-up')
  assert.equal(protection.lastEvent, 'newest-vote')
  assert.ok(protection.failures.every((message) => message.includes('modifiée dans une autre fenêtre')))
  assert.equal(protection.successfulConcurrentWriters, 1)
  assert.equal(protection.finalRevision, 2)
  results.push({ atomicJournal: protection })
  await writeFile('docs/interactive/session-lease-results.json', JSON.stringify(results, null, 2) + '\n')
  console.log(JSON.stringify(results, null, 2))
} finally { await browser.close() }
