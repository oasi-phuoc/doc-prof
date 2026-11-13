import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { createServer } from 'vite'
import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'
import { serveCompetition } from './competition-server.mjs'

const base = 'http://127.0.0.1:5182', apiBase = 'http://127.0.0.1:5193', teacherKey = `fixture-only-${crypto.randomUUID()}`
process.env.VITE_COMPETITION_API_URL = `${apiBase}/competition`
const vite = await createServer({ cacheDir: '/tmp/clairfle-competition-browser-vite', server: { host: '127.0.0.1', port: 5182, strictPort: true } })
await vite.listen()
const service = await serveCompetition(vite, { origin: base, teacherKey })
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] })
const results = [], errors = []
const button = (page, name) => page.getByRole('button', { name, exact: true })
async function setup(page) {
  await page.context().addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  await page.goto(`${base}/interactif/demo`)
  await page.locator('.ci-launch:enabled').waitFor({ timeout: 120000 })
  await button(page, 'Tout désélectionner').click()
  const checks = page.locator('.ci-question-list fieldset > label input[type=checkbox]')
  await checks.nth(0).check(); await checks.nth(1).check()
  await page.getByRole('checkbox', { name: 'Activer le minuteur', exact: true }).uncheck()
  await button(page, 'Régler le minuteur').click()
  await page.getByRole('spinbutton', { name: 'Temps entre les questions (secondes)', exact: true }).fill('10')
  await button(page, 'Fermer les réglages').click()
  await button(page, 'Compétition').click()
  await page.getByRole('heading', { name: 'Jouer en compétition', exact: true }).waitFor()
}
async function publicClean(page) {
  assert.equal(await page.locator('input:not([aria-label="Code de salle"])').count(), 0)
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
  assert.deepEqual(result.violations.map((item) => ({ id: item.id, nodes: item.nodes.map((n) => n.target) })), [])
}
async function fits(page, width, height) {
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
  for (const element of await page.locator('.ci-competition-question .ci-answer, .ci-competition-clock, .ci-competition-host-controls').all()) {
    const bounds = await element.boundingBox()
    if (bounds) assert.ok(bounds.x >= -1 && bounds.y >= -1 && bounds.x + bounds.width <= width + 1 && bounds.y + bounds.height <= height + 1, JSON.stringify(bounds))
  }
}
try {
  const hostContext = await browser.newContext({ viewport: { width: 1366, height: 768 } }), host = await hostContext.newPage()
  host.on('pageerror', (error) => errors.push(error.message))
  await setup(host)
  await host.getByLabel('Accès enseignant aux salles', { exact: true }).fill(teacherKey)
  await button(host, 'Créer la salle').click()
  await host.locator('.ci-competition-code').waitFor()
  const code = (await host.locator('.ci-competition-code').innerText()).trim()
  assert.match(code, /^\d{6}$/)
  await host.getByAltText(`Scanner pour rejoindre la salle ${code}`).waitFor()
  const learners = []
  for (let i = 0; i < 2; i++) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } }), page = await context.newPage()
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto(`${base}/interactif/rejoindre/${code}`)
    await page.getByRole('heading', { name: 'Rejoins la compétition', exact: true }).waitFor()
    assert.equal(await page.getByRole('group', { name: 'Choisir ta mascotte', exact: true }).getByRole('button').count(), 30)
    await publicClean(page)
    await button(page, i ? 'Tigre' : 'Panda').click(); await button(page, 'Rejoindre la salle').click()
    await page.getByText('Tu es dans la salle. Attends le départ.', { exact: true }).waitFor()
    learners.push({ context, page })
  }
  await host.getByRole('status').filter({ hasText: '2 joueur(s)' }).waitFor()
  await button(host, 'Commencer la compétition').click()
  for (const { page } of learners) await page.locator('.ci-competition-question .ci-answer:enabled').first().waitFor()
  const stored = service.snapshot(code), q = stored.room.quiz.items[0], correctIndex = q.question.choices.findIndex((choice) => choice.id === q.correctChoiceId)
  const captured = await learners[0].page.evaluate(async ({ apiBase, code }) => { const capability = JSON.parse(sessionStorage.getItem(`clairfle.competition.player.${code}`)); const response = await fetch(`${apiBase}/competition/rooms/${code}`, { headers: { Authorization: `Bearer ${capability.token}` } }); return response.json() }, { apiBase, code })
  assert.equal(captured.view.correctChoiceId, undefined); assert.equal(captured.view.question.id, 'q1'); assert.ok(!JSON.stringify(captured.view).includes('hostHash'))
  assert.equal(await host.locator('.ci-answer:enabled').count(), 0)
  await learners[0].page.locator('.ci-answer').nth(correctIndex).click()
  await learners[0].page.getByRole('status').filter({ hasText: 'Réponse envoyée.' }).waitFor()
  assert.equal(await learners[0].page.locator('.ci-answer-key').count(), 0)
  await learners[1].page.locator('.ci-answer').nth((correctIndex + 1) % q.question.choices.length).click()
  for (const { page } of learners) { await page.locator('.ci-answer-key').waitFor(); assert.equal(await page.locator('.ci-answer-muted').count(), 5); await fits(page, 390, 844) }
  assert.equal(service.snapshot(code).room.players[0].score, 1000)
  service.restart(code)
  await learners[0].page.reload()
  await learners[0].page.locator('.ci-answer-key').waitFor()
  await button(learners[0].page, 'Voir le classement').click()
  await learners[0].page.getByRole('dialog', { name: 'Classement', exact: true }).waitFor()
  assert.ok((await learners[0].page.locator('.ci-competition-scores').innerText()).includes('1 000'))
  await button(learners[0].page, 'Revenir au jeu').click()
  await learners[0].page.screenshot({ path: 'docs/interactive/screenshots/competition-online-390.png' })
  await host.locator('.ci-answer-key').waitFor()
  await button(host, 'Terminer la compétition').click(); await button(host, 'Terminer et voir le classement').click()
  await host.getByRole('heading', { name: 'Bravo à tous !', exact: true }).waitFor()
  results.push({ online: 'real Worker router and room objects over HTTP; host and two independent browsers; public join without account or name; 30 mascot choices and QR', grading: 'server score, hidden key until reveal, one submitted answer, six-card correction and durable restart', accessibility: 'axe join screens pass; phone answer cards and controls fit', source: 'two selected worksheet questions kept' })
  for (const learner of learners) await learner.context.close()
  await hostContext.close()

  const resumeContext = await browser.newContext({ viewport: { width: 390, height: 844 } }), resume = await resumeContext.newPage()
  resume.on('pageerror', (error) => errors.push(error.message))
  await setup(resume)
  await button(resume, 'Préparer le défi local').click()
  await resume.getByRole('heading', { name: 'Défi sur cet appareil', exact: true }).waitFor()
  await button(resume, 'Ajouter cette mascotte').click()
  await button(resume, 'Renard').click(); await button(resume, 'Ajouter cette mascotte').click()
  await button(resume, 'Commencer la compétition').click(); await button(resume, 'Je suis prêt').click()
  await resume.locator('.ci-answer:enabled').first().click()
  await resume.getByRole('heading', { name: 'À toi !', exact: true }).waitFor()
  await button(resume, 'Je suis prêt').click()
  await resume.locator('.ci-answer:enabled').first().waitFor()
  const localKey = await resume.evaluate(() => Object.keys(sessionStorage).find((key) => key.startsWith('clairfle.competition.local.')))
  await button(resume, 'Quitter la compétition').click()
  await button(resume, 'Compétition').click()
  await button(resume, 'Reprendre le défi local').click()
  await resume.getByRole('heading', { name: 'Pause', exact: true }).waitFor()
  assert.equal(await resume.locator('.ci-answer').count(), 0)
  await resume.locator('.ci-competition-pause').getByRole('button', { name: 'Reprendre', exact: true }).click()
  await resume.locator('.ci-answer:enabled').first().click()
  await resume.locator('.ci-answer-key').waitFor()
  const resumedJournal = await resume.evaluate((key) => JSON.parse(sessionStorage.getItem(key)), localKey)
  assert.equal(resumedJournal.events.filter((event) => event.action.type === 'join').length, 2)
  assert.equal(resumedJournal.events.filter((event) => event.action.type === 'answer').length, 2)
  assert.ok(resumedJournal.events.some((event) => event.action.type === 'pause'))
  await button(resume, 'Terminer la compétition').click(); await button(resume, 'Terminer et voir le classement').click()
  await button(resume, 'Nouvelle compétition').click()
  await button(resume, 'Préparer le défi local').click()
  await resume.getByRole('heading', { name: 'Défi sur cet appareil', exact: true }).waitFor()
  assert.equal(await resume.locator('.ci-competition-scores > li').count(), 0)
  await button(resume, 'Ajouter cette mascotte').click()
  assert.equal(await resume.evaluate(() => Object.keys(sessionStorage).filter((key) => key.startsWith('clairfle.competition.local.')).length), 2)
  results.push({ resume: 'exit pauses the second player; reopening retains the exact seed, two mascots and both answers; explicit new competition creates a fresh journal and empty roster' })
  await resumeContext.close()

  for (const [width, height] of [[390, 844], [1366, 768]]) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' }), page = await context.newPage()
    page.on('pageerror', (error) => errors.push(error.message))
    await setup(page)
    await button(page, 'Préparer le défi local').click()
    await page.getByRole('heading', { name: 'Défi sur cet appareil', exact: true }).waitFor()
    await button(page, 'Panda').click(); await button(page, 'Ajouter cette mascotte').click()
    await button(page, 'Renard').click(); await button(page, 'Ajouter cette mascotte').click()
    assert.equal(await page.locator('.ci-competition-scores > li').count(), 2)
    await context.setOffline(true)
    await page.clock.install()
    await page.clock.pauseAt(new Date(await page.evaluate(() => Date.now()) + 100))
    await button(page, 'Commencer la compétition').click()
    await page.getByRole('heading', { name: 'À toi !', exact: true }).waitFor()
    assert.equal(await page.locator('.ci-answer').count(), 0)
    for (let question = 0; question < 2; question++) {
      for (let player = 0; player < 2; player++) {
        await button(page, 'Je suis prêt').click()
        await page.locator('.ci-answer:enabled').first().waitFor()
        await fits(page, width, height)
        if (question === 0 && player === 0) await page.screenshot({ path: `docs/interactive/screenshots/competition-local-${width}.png` })
        await page.locator('.ci-answer').first().click()
        if (player === 0) { await page.getByRole('heading', { name: 'À toi !', exact: true }).waitFor(); assert.equal(await page.locator('.ci-answer-key, .ci-answer').count(), 0) }
      }
      await page.locator('.ci-answer-key').waitFor()
      assert.equal(await page.locator('.ci-answer-muted').count(), 5)
      await page.clock.runFor(10_100)
    }
    await page.getByRole('heading', { name: 'Bravo à tous !', exact: true }).waitFor()
    const journal = await page.evaluate(() => Object.keys(sessionStorage).filter((key) => key.startsWith('clairfle.competition.local.')).map((key) => sessionStorage.getItem(key))[0])
    assert.ok(journal.includes('answer')); assert.ok(!journal.includes('correctChoiceId')); assert.ok(!journal.includes('prompt'))
    assert.equal(await page.locator('.ci-competition-avatar').first().evaluate((element) => getComputedStyle(element).animationName), 'ci-competition-bob')
    results.push({ local: `${width}x${height}`, offline: 'network disabled before departure; two mascots play both questions and see scores', privacy: 'handoff hides previous answer and question; correction waits for both players', storage: 'action journal contains no questions or answer keys', motion: 'generated avatars animate even with reduced-motion preference' })
    await context.close()
  }
  assert.deepEqual(errors, [])
  await writeFile('docs/interactive/competition-results.json', JSON.stringify({ results, errors, productionService: 'not deployed by these local tests' }, null, 2) + '\n')
  console.log(JSON.stringify(results, null, 2))
} finally { await browser.close(); await service.close(); await vite.close() }
