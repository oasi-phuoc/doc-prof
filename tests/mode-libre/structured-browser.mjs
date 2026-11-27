import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { createServer } from 'vite'

const server = process.env.BASE_URL ? null : await createServer({
  server: { host: '127.0.0.1', port: 0 },
  define: { 'import.meta.env.VITE_FICHES_API_URL': JSON.stringify('/__libre_fiches') },
})
let browser
const png = 'iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAFElEQVR4nGPU9r7DgA0wYRUdtBIAC9IBYkd6Sd0AAAAASUVORK5CYII='
const image = 'data:image/png;base64,' + png
const button = (page, name) => page.getByRole('button', { name, exact: true })
const worksheet = (page) => page.locator('.a4-frame .worksheet-sheet').first()
const liveQuestion = (page) => page.locator('#activity-editor .tcf-question-editor').first()

function recipe(exerciseType, topic, exercise) {
  return {
    version: 1, seed: 20261127, institutional: {}, evalMode: false,
    pointsPerQuestion: 1, libreMode: false, libreSnapshot: null,
    pages: [
      { domain: 'tpf', topic, exerciseType, difficulty: 'facile', count: 1, columns: 1, tcfExercise: exercise },
    ],
  }
}

const shared = {
  id: 'libre-docs-temoin', niveau: 'A0-A1', competence: 'CE', type_exercice: 'email',
  support: { de: 'Chloé', a: 'Inès', objet: 'Rendez-vous', texte: 'Le rendez-vous est à huit heures.' },
  questions: [
    { type_reponse: 'lignes', enonce: 'À quelle heure ?', reponse_modele: 'À huit heures.' },
    { type_reponse: 'lignes', enonce: 'Qui reçoit le message ?', reponse_modele: 'Inès.' },
  ],
}
const qcm = {
  id: 'libre-qcm-temoin', niveau: 'A0-A1', competence: 'CO', type_exercice: 'six_courts',
  support: { audios: ['/lib/audio/test-fixture-audio.mp3'] },
  questions: [
    {
      type_reponse: 'qcm_image', audio: 1, melanger: false,
      enonce: 'Quelle image correspond à la question ?',
      choix: ['a', 'b', 'c', 'd'].map((id) => ({ id, image, correct: id === 'd' })),
    },
  ],
}

async function openFiche(page, data, expectQuestions = true) {
  await page.addInitScript((recipe) => {
    localStorage.setItem('clairfle-fiche-sync', 'libre-test-only')
    if (!history.state?.clairfleFiche) history.replaceState({
      ...history.state, clairfleFiche: { id: 'fixture', name: 'Témoin Libre', recipe },
    }, '')
  }, data)
  await page.goto('/generateur')
  await worksheet(page).waitFor()
  await button(page, 'Mode libre').click()
  if (expectQuestions) await liveQuestion(page).waitFor()
  assert.equal(await button(page, 'Valider les changements').count(), 0)
}

async function documentPilot(page) {
  await openFiche(page, recipe('tcf-ce-ex-4', 'tcf-ce', shared))
  const panel = page.locator('#activity-editor .tcf-editor')
  assert.equal(await page.locator('#activity-editor .tcf-question-editor').count(), 2)
  await panel.getByRole('textbox', { name: 'Texte', exact: true }).fill('Le rendez-vous est à neuf heures.')
  assert.match(await worksheet(page).innerText(), /neuf heures/)
  const rows = page.locator('#activity-editor .tcf-question-editor')
  for (const row of await rows.all()) {
    assert.equal(await row.getByText('Corrigé à vérifier', { exact: true }).count(), 1)
  }
  await liveQuestion(page).getByRole('textbox', { name: 'Réponse modèle (corrigé)', exact: true }).fill('À neuf heures.')
  await button(liveQuestion(page), 'Confirmer le corrigé').click()
  assert.equal(await liveQuestion(page).getByText('Corrigé à vérifier', { exact: true }).count(), 0)
  await button(page, 'Annuler').click()
  assert.equal(await liveQuestion(page).getByText('Corrigé à vérifier', { exact: true }).count(), 1)
  await button(page, 'Rétablir').click()
  assert.equal(await liveQuestion(page).getByText('Corrigé à vérifier', { exact: true }).count(), 0)

  await button(liveQuestion(page), 'Verrouiller la question').click()
  assert(await button(page, 'Autre série au hasard').isDisabled())
  await button(page, 'Fermer le mode libre').click()
  assert.match(await worksheet(page).innerText(), /neuf heures/)
  await button(page, 'Mode libre').click()
  assert.equal(await button(liveQuestion(page), 'Question verrouillée').getAttribute('aria-pressed'), 'true')
}

async function qcmPilot(page) {
  let saved
  await page.route('**/fiches/fixture', async (route) => {
    assert.equal(route.request().method(), 'PUT')
    const { name, recipe } = route.request().postDataJSON()
    saved = recipe
    await route.fulfill({
      json: { fiche: { id: 'fixture', name, domains: ['tpf'], createdAt: '2026-11-27T00:00:00Z', updatedAt: '2026-11-27T00:00:00Z', recipe } },
    })
  })
  await openFiche(page, recipe('tcf-co-ex-1', 'tcf-co', qcm))
  const question = liveQuestion(page)
  const files = question.locator('.tcf-choix-row input[type=file]')
  assert.equal(await files.count(), 4)
  await files.first().setInputFiles({ name: 'temoin.png', mimeType: 'image/png', buffer: Buffer.from(png, 'base64') })
  await question.locator('.tcf-choix-row img[src^="data:image/webp"]').waitFor()
  assert.equal(await question.locator('.tcf-choix-row img[src^="data:image/webp"]').count(), 1)
  assert.equal(await worksheet(page).locator('img[src^="data:image/webp"]').count(), 1)

  await button(question, 'Supprimer le choix D').click()
  assert.equal(await question.locator('input[type=radio]:checked').count(), 0)
  assert(await button(question, 'Confirmer le corrigé').isDisabled())
  await page.evaluate(() => {
    window.print = () => {
      document.documentElement.dataset.printedSheets = String(document.querySelectorAll('.print-only-sheets .worksheet-sheet').length)
    }
  })
  const print = button(page, 'Imprimer la fiche et le corrigé')
  page.once('dialog', async (dialog) => {
    assert.match(dialog.message(), /fiche élève seule/)
    await dialog.accept()
  })
  await print.click()
  await page.locator('html[data-printed-sheets="1"]').waitFor({ state: 'attached' })

  await button(page, 'Enregistrer').click()
  const save = page.getByRole('dialog', { name: 'Enregistrer la fiche' })
  await save.getByRole('textbox', { name: 'Enregistré par', exact: true }).fill('Enseignant Témoin')
  await button(save, 'Mettre à jour').click()
  await save.waitFor({ state: 'detached' }).catch(async (error) => {
    const issue = await save.getByRole('alert').textContent({ timeout: 3000 }).catch(() => '')
    throw new Error(issue || error.message)
  })
  const storedQuestion = saved.pages[0].tcfExercise.questions[0]
  assert(storedQuestion.libreId)
  assert.equal(storedQuestion.correctionARevoir, true)
  assert.match(storedQuestion.choix[0].image, /^data:image\/webp/)
  assert.equal(storedQuestion.choix[1].image, image)

  await page.reload()
  await liveQuestion(page).getByText('Corrigé à vérifier', { exact: true }).waitFor()
  assert.equal(await worksheet(page).locator('img[src^="data:image/webp"]').count(), 1)
  await liveQuestion(page).locator('input[type=radio]').first().check()
  await button(liveQuestion(page), 'Confirmer le corrigé').click()
  assert.equal(await liveQuestion(page).getByText('Corrigé à vérifier', { exact: true }).count(), 0)
}

async function audioGroups(page) {
  const sample = {
    ...qcm,
    support: { audios: [qcm.support.audios[0], '/lib/audio/second-fixture-audio.mp3'] },
    questions: ['Premier dialogue', 'Dialogue à conserver'].map((enonce, index) => ({
      type_reponse: 'qcm_texte', audio: index + 1, enonce,
      choix: [{ id: 'oui', texte: 'Oui', correct: true }, { id: 'non', texte: 'Non', correct: false },
        { id: 'jamais', texte: 'Jamais', correct: false }],
    })),
  }
  await openFiche(page, recipe('tcf-co-ex-2', 'tcf-co', sample))
  const rows = page.locator('#activity-editor .tcf-six-courts-audio')
  await rows.nth(1).waitFor()
  await button(rows.nth(1), 'Verrouiller la question').click()
  await button(page, 'Supprimer l’audio 1 et ses questions').click()
  assert.equal(await rows.count(), 1)
  assert.match(await worksheet(page).innerText(), /Dialogue à conserver/)
  assert.doesNotMatch(await worksheet(page).innerText(), /Premier dialogue/)
  assert.equal(await button(rows.first(), 'Question verrouillée').getAttribute('aria-pressed'), 'true')
  assert.equal(await rows.first().getByText('Corrigé à vérifier', { exact: true }).count(), 0)
  await button(page, 'Annuler').click()
  assert.equal(await rows.count(), 2)
  assert.match(await worksheet(page).innerText(), /Premier dialogue/)
}

async function writing(page) {
  await openFiche(page, recipe('tcf-pe-ex-4', 'tcf-pe', {
    id: 'libre-ecriture-temoin', niveau: 'A0-A1', competence: 'PE', type_exercice: 'question_texte', questions: [],
    support: { consigne: 'Décrivez votre journée.', nb_mots: { min: 10, max: 30 }, reponse_modele: 'Je me lève tôt.' },
  }), false)
  const prompt = page.getByRole('textbox', { name: 'Question / texte', exact: true })
  await prompt.fill('Prévenez votre responsable que vous serez en retard.')
  assert.match(await worksheet(page).innerText(), /Prévenez votre responsable/)
  assert.doesNotMatch(await worksheet(page).innerText(), /Je me lève tôt/)
  const review = button(page, 'Confirmer le corrigé du support')
  await review.waitFor()
  await prompt.blur()
  await prompt.fill('')
  assert(await review.isDisabled())
  await button(page, 'Annuler').click()
  assert.match(await worksheet(page).innerText(), /Prévenez votre responsable/)
  await page.getByRole('textbox', { name: 'Réponse modèle (corrigé)', exact: true }).fill('Bonjour, je serai en retard de dix minutes.')
  await review.click()
  assert.equal(await review.count(), 0)
  await button(page, 'Fermer le mode libre').click()
  assert.match(await worksheet(page).innerText(), /Prévenez votre responsable/)
}

try {
  await server?.listen()
  const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:' + server.httpServer.address().port
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? '/usr/bin/chromium' })
  const context = await browser.newContext({ baseURL, viewport: { width: 1366, height: 900 } })
  await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: baseURL }])
  const documentPage = await context.newPage()
  await documentPilot(documentPage)
  await documentPage.close()
  const qcmPage = await context.newPage()
  await qcmPilot(qcmPage)
  await qcmPage.close()
  const audioPage = await context.newPage()
  await audioGroups(audioPage)
  await audioPage.close()
  await writing(await context.newPage())
  await context.close()
  console.log('Document partagé, corrigés à vérifier, QCM illustré, réouverture et liaison audio testés.')
} finally {
  await browser?.close()
  await server?.close()
}
