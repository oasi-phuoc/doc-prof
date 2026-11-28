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
  const settings = page.locator('#activity-editor .worksheet-settings')
  await settings.getByText('Présentation du contenu', { exact: true }).click()
  const secondQuestion = settings.getByRole('group', { name: 'Question 2', exact: true })
  const pageBreak = button(secondQuestion, 'Passer cette question et les suivantes sur une nouvelle page')
  await pageBreak.waitFor()
  assert.equal(await page.locator('.a4-frame .tcf-page-chip').count(), 0)
  await pageBreak.click()
  await page.locator('.a4-frame').nth(1).waitFor()
  await button(page, 'Annuler').click()
  assert.equal(await page.locator('.a4-frame').count(), 1)
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

async function doubleA5Document(page) {
  const data = recipe('tcf-ce-ex-4', 'tcf-ce', shared)
  data.printCorrections = false
  data.pages[0].contentSeedTwin = 87
  await openFiche(page, data)
  const halves = page.locator('.a4-frame .a5-half')
  const panel = page.locator('#activity-editor .tcf-editor')
  const source = panel.getByRole('textbox', { name: 'Texte', exact: true })
  await source.fill('Le rendez-vous est à dix heures.')
  const invalidCorrection = panel.getByText('Corrigé à vérifier', { exact: true })
  assert.equal(await invalidCorrection.count(), 2)

  const editor = page.locator('#activity-editor')
  await editor.getByText('Mise en page de la fiche', { exact: true }).click()
  await editor.getByRole('radio', { name: /Paysage — double A5/ }).click()
  assert(await button(page, 'Mode libre').isDisabled())
  assert.equal(await editor.count(), 0)
  assert.equal(await halves.getByText('Le rendez-vous est à dix heures.', { exact: true }).count(), 2)
  await page.emulateMedia({ media: 'print' })
  const printed = page.locator('.print-only-sheets .a5-half')
  assert.equal(await printed.count(), 2)
  assert.equal(await printed.getByText('Le rendez-vous est à dix heures.', { exact: true }).count(), 2)
  const reserves = await printed.evaluateAll((halves) => halves.map((half) =>
    half.querySelector('.doc-footer').getBoundingClientRect().top -
    half.querySelector('.exercise-grid').getBoundingClientRect().bottom))
  assert(reserves.every((reserve) => reserve >= 0), `Réserves avant le pied de page ${reserves.join(', ')}`)
  assert((await page.pdf({ preferCSSPageSize: true })).subarray(0, 4).equals(Buffer.from('%PDF')))
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

async function pictureRecognition(page) {
  await openFiche(page, recipe('tcf-co-ex-5', 'tcf-co', {
    id: 'libre-images-temoin', niveau: 'A0-A1', competence: 'CO', type_exercice: 'images_a_reconnaitre', questions: [],
    support: { audio: '/lib/audio/test-fixture-audio.mp3' }, melanger: false,
    images: ['a', 'b', 'c', 'd', 'e'].map((id) => ({ id, image, correct: id === 'a' })),
  }), false)
  const images = page.locator('#activity-editor .tcf-choix-row')
  const review = button(page, 'Confirmer le corrigé du support')
  await images.first().getByRole('checkbox', { name: 'à cocher', exact: true }).uncheck()
  assert(await review.isDisabled())
  await images.nth(2).getByRole('checkbox', { name: 'à cocher', exact: true }).check()
  assert(await review.isEnabled())
  await images.nth(2).locator('input[type=file]').setInputFiles({ name: 'temoin.png', mimeType: 'image/png', buffer: Buffer.from(png, 'base64') })
  await worksheet(page).locator('img[src^="data:image/webp"]').waitFor()
  assert.equal(await worksheet(page).locator('img[src^="data:image/webp"]').count(), 1)
  await review.click()
  assert.equal(await review.count(), 0)
}

async function worksheetImage(page) {
  let saved
  await page.route('**/lib/images/vocabulaire/**', (route) => route.fulfill({
    contentType: 'image/png', body: Buffer.from(png, 'base64'),
  }))
  await page.route('**/fiches/fixture', async (route) => {
    const { name, recipe } = route.request().postDataJSON()
    saved = recipe
    await route.fulfill({ json: { fiche: { id: 'fixture', name, domains: ['alphabetisation'],
      createdAt: '2026-11-27T00:00:00Z', updatedAt: '2026-11-27T00:00:00Z', recipe } } })
  })
  const config = recipe('alpha-a-mots', 'alpha-voyelles')
  config.pages[0] = { ...config.pages[0], domain: 'alphabetisation', count: 3, columns: 3 }
  await openFiche(page, config, false)
  const firstImage = worksheet(page).locator('.vocab-card-image img[role=button]').first()
  const original = await firstImage.getAttribute('src')
  const settings = page.locator('#activity-editor .worksheet-settings')
  await settings.getByText('Présentation du contenu', { exact: true }).click()
  await button(settings, 'Remplacer l’image').first().click()
  const picker = page.getByRole('dialog', { name: 'Choisir une image vocabulaire', exact: true })
  await picker.getByLabel('Importer une image', { exact: true }).setInputFiles({
    name: 'temoin.png', mimeType: 'image/png', buffer: Buffer.from(png, 'base64'),
  })
  await picker.waitFor({ state: 'detached' })
  const image = worksheet(page).locator('.vocab-card-image img[src^="data:image/webp"]')
  await image.waitFor()
  assert.equal(await image.count(), 1)
  await button(page, 'Enregistrer').click()
  const save = page.getByRole('dialog', { name: 'Enregistrer la fiche' })
  await save.getByRole('textbox', { name: 'Enregistré par', exact: true }).fill('Enseignant Témoin')
  await button(save, 'Mettre à jour').click()
  await save.waitFor({ state: 'detached' })
  assert.match(saved.imageOverrides[original], /^data:image\/webp/)
  await page.reload()
  await image.waitFor()
  assert.equal(await image.count(), 1)
}

async function formAndOral(context) {
  const form = await context.newPage()
  await openFiche(form, recipe('tcf-pe-ex-1', 'tcf-pe', {
    id: 'libre-formulaire-temoin', niveau: 'A0-A1', competence: 'PE', type_exercice: 'formulaire', questions: [],
    support: { titre: 'Inscriptions', champs: [{ label: 'Prénom', type: 'texte', corrige: 'Alicia' }] },
  }), false)
  await form.getByRole('textbox', { name: 'Libellé', exact: true }).fill('Prénom de la personne à joindre')
  assert.match(await worksheet(form).innerText(), /Prénom de la personne à joindre/)
  assert.doesNotMatch(await worksheet(form).innerText(), /Alicia/)
  await form.getByRole('textbox', { name: 'Corrigé', exact: true }).fill('')
  assert(await button(form, 'Confirmer le corrigé du support').isDisabled())
  await form.close()

  const oral = await context.newPage()
  await openFiche(oral, recipe('tcf-po', 'tcf-po', {
    id: 'libre-oral-temoin', niveau: 'A0-A1', competence: 'PO', type_exercice: 'mots_theme', questions: [],
    support: { theme: 'Courses', mots: ['pain', 'lait'], exemples_questions: ['Qu’avez-vous acheté ?'] },
  }), false)
  await oral.getByRole('textbox', { name: 'Thème', exact: true }).fill('L’atelier de français')
  assert.match(await worksheet(oral).innerText(), /L’atelier de français/)
  assert.doesNotMatch(await worksheet(oral).innerText(), /Qu’avez-vous acheté/)
  await button(oral, 'Confirmer le corrigé du support').click()
  await button(oral, 'Fermer le mode libre').click()
  assert.match(await worksheet(oral).innerText(), /L’atelier de français/)
  await oral.close()
}

function theoryRecipe(config) {
  const data = recipe(config.exerciseType, config.topic)
  data.printCorrections = false
  data.pages[0] = { ...data.pages[0], ...config }
  return data
}

async function removeTheoryParts(context) {
  const theoryItem = (theoryBlock) => ({ layout: 'theory', answer: '', theoryBlock })
  const items = [
    theoryItem({ kind: 'heading', text: 'Théorie témoin' }),
    theoryItem({ kind: 'paragraph', text: 'À retirer avant la coupure.' }),
    theoryItem({ kind: 'section', role: 'expliquer', blocks: [
      { kind: 'paragraph', text: 'Ce paragraphe est facultatif.' },
      { kind: 'paragraph', text: 'Le paragraphe voisin est conservé.' },
    ] }),
    theoryItem({ kind: 'paragraph', text: 'Début de la deuxième page.' }),
  ]

  const grammar = await context.newPage()
  let saved
  await grammar.route('**/fiches/fixture', async (route) => {
    assert.equal(route.request().method(), 'PUT')
    const { name, recipe: stored } = route.request().postDataJSON()
    saved = stored
    await route.fulfill({ json: { fiche: { id: 'fixture', name, domains: ['grammaire'],
      createdAt: '2026-11-28T00:00:00Z', updatedAt: '2026-11-28T00:00:00Z', recipe: stored } } })
  })
  await openFiche(grammar, theoryRecipe({
    domain: 'grammaire', topic: 'gram-entrer-contact', exerciseType: 'gram-b1-theorie',
    libreItems: items, tcfPageBreakAfter: [false, false, true, false],
  }), false)
  const editor = grammar.getByLabel('Contenu de la théorie', { exact: true })
  const blocks = editor.locator(':scope > details')
  const sheets = grammar.locator('.print-only-sheets .worksheet-sheet')
  assert.equal(await sheets.count(), 2)
  await blocks.nth(2).locator(':scope > summary').click()
  await button(blocks.nth(2), 'Retirer le paragraphe').click()
  assert.doesNotMatch(await sheets.first().textContent(), /Ce paragraphe est facultatif/)
  assert.match(await sheets.first().textContent(), /Le paragraphe voisin est conservé/)
  await blocks.nth(1).locator(':scope > summary').click()
  await button(blocks.nth(1), 'Retirer le paragraphe').click()
  assert.equal(await sheets.count(), 2)
  assert.match(await sheets.nth(1).textContent(), /Début de la deuxième page/)
  assert.doesNotMatch(await sheets.first().textContent(), /À retirer avant la coupure/)
  await button(grammar, 'Annuler').click()
  assert.match(await sheets.first().textContent(), /À retirer avant la coupure/)
  await button(grammar, 'Rétablir').click()
  await button(grammar, 'Enregistrer').click()
  const save = grammar.getByRole('dialog', { name: 'Enregistrer la fiche' })
  await save.getByRole('textbox', { name: 'Enregistré par', exact: true }).fill('Enseignant Témoin')
  await button(save, 'Mettre à jour').click()
  await save.waitFor({ state: 'detached' })
  assert.equal(saved.pages[0].libreItems.length, 3)
  assert.deepEqual(saved.pages[0].tcfPageBreakAfter, [false, true, false])
  await grammar.reload()
  await sheets.nth(1).waitFor({ state: 'attached' })
  assert.doesNotMatch((await sheets.allTextContents()).join(' '), /Ce paragraphe est facultatif|À retirer avant la coupure/)
  await grammar.close()

  for (const config of [
    { domain: 'logistique-afp', topic: 'log-afp-theme-100', exerciseType: 'log-afp-101-theorie' },
    { domain: 'logistique-cfc', topic: 'log-cfc-theme-100', exerciseType: 'log-cfc-101-theorie' },
    { domain: 'société', topic: 'societe-voisins', exerciseType: 'societe-voisins-theorie' },
    { domain: 'santé', topic: 'sante-corps', exerciseType: 'sante-corps-theorie-a1' },
  ]) {
    const page = await context.newPage()
    await openFiche(page, theoryRecipe({ ...config, libreItems: items }), false)
    const section = page.getByLabel('Contenu de la théorie', { exact: true }).locator(':scope > details').nth(2)
    await section.locator(':scope > summary').click()
    await button(section, 'Retirer la section').click()
    assert.doesNotMatch((await page.locator('.print-only-sheets').allTextContents()).join(' '), /Le paragraphe voisin est conservé/)
    assert.match(await worksheet(page).textContent(), /Théorie témoin/)
    await button(page, 'Annuler').click()
    assert.match((await page.locator('.print-only-sheets').allTextContents()).join(' '), /Le paragraphe voisin est conservé/)
    await page.close()
  }

  for (const config of [
    { domain: 'algèbre', topic: 'addition', exerciseType: 'math-theorie-addition' },
    { domain: 'géométrie', topic: 'figures', exerciseType: 'math-theorie-figures' },
  ]) {
    const page = await context.newPage()
    await openFiche(page, theoryRecipe(config), false)
    const panel = page.getByLabel('Contenu de la théorie', { exact: true })
    const lesson = worksheet(page).locator('.math-theory-lesson').first()
    const vocabulary = await lesson.locator('dt').allTextContents()
    await button(panel, 'Retirer le vocabulaire').click()
    assert.equal(await lesson.locator('dl').count(), 0)
    await button(panel, 'Retirer l’exemple').click()
    assert.equal(await lesson.locator('figcaption, .math-theory-example').count(), 0)
    assert(await lesson.locator('h3').isVisible())
    await button(page, 'Annuler').click()
    await button(page, 'Annuler').click()
    assert.deepEqual(await lesson.locator('dt').allTextContents(), vocabulary)
    await page.close()
  }

  for (const config of [
    { domain: 'géométrie', topic: 'glossaire-geometrie', exerciseType: 'glossaire-geometrie-mots' },
    { domain: 'logistique-afp', topic: 'log-afp-theme-100', exerciseType: 'log-afp-101-glossaire' },
    { domain: 'société', topic: 'societe-voisins', exerciseType: 'societe-voisins-lexique' },
  ]) {
    const page = await context.newPage()
    await openFiche(page, theoryRecipe(config), false)
    const panel = page.getByLabel('Contenu de la théorie', { exact: true })
    assert.equal(await panel.getByRole('button', { name: /^Retirer / }).count(), 0)
    await page.close()
  }
}

async function alphaStoryReading(context) {
  const config = { domain: 'alphabetisation', topic: 'alpha-phrases', exerciseType: 'alpha-phrase-le-chat-lire-phrases' }
  for (const archive of [false, true]) {
    const page = await context.newPage()
    const data = theoryRecipe({
      ...config,
      ...(archive ? { libreItems: [
        { layout: 'text', prompt: 'Le chat longe la fenêtre.', answer: 'Le chat longe la fenêtre.' },
        { layout: 'text', prompt: 'La pluie tombe dans la cour.', answer: 'La pluie tombe dans la cour.' },
      ] } : {}),
    })
    data.evalMode = true
    await openFiche(page, data, false)
    const panel = page.locator('#activity-editor')
    const first = panel.getByRole('textbox', { name: 'Phrase 1', exact: true })
    const original = await first.inputValue()
    assert(original)
    if (archive) assert.equal(original, 'Le chat longe la fenêtre.')
    assert.equal(await panel.getByRole('spinbutton', { name: 'Nombre de questions', exact: true }).count(), 0)
    assert.equal(await panel.getByRole('spinbutton', { name: /Points par question/ }).count(), 0)
    const written = worksheet(page).locator('.prompt-stack-text')
    const sentences = await written.allTextContents()
    await first.fill('Le chat regarde tomber la pluie.')
    assert.deepEqual(await written.allTextContents(), ['Le chat regarde tomber la pluie.', ...sentences.slice(1)])
    assert.equal(await worksheet(page).locator('.answer-line-field').count(), 0)
    await button(page, 'Annuler').click()
    assert.equal(await first.inputValue(), original)
    await button(page, 'Rétablir').click()
    await button(page, 'Fermer le mode libre').click()
    assert.match(await page.locator('.print-only-sheets .worksheet-sheet').first().textContent(), /Le chat regarde tomber la pluie/)
    assert.equal(await page.getByRole('spinbutton', { name: 'Nombre de questions', exact: true }).count(), 0)
    await page.close()
  }
}

async function alphaDictation(context) {
  for (const [topic, exerciseType, word] of [
    ['alpha-syllabes', 'alpha-syll-a-dictee-mots', 'pla'],
    ['alpha-phrases', 'alpha-phrase-le-chat-dictee-mots', 'gouttière'],
  ]) {
    const page = await context.newPage()
    const data = theoryRecipe({ domain: 'alphabetisation', topic, exerciseType, count: 2 })
    data.printCorrections = true
    await openFiche(page, data, false)
    const panel = page.locator('#activity-editor')
    const first = panel.getByRole('textbox', { name: 'Mot dicté 1', exact: true })
    const quantity = panel.getByRole('spinbutton', { name: 'Nombre de mots', exact: true })
    const correction = page.locator('.print-only-sheets .worksheet-sheet').last()
    await first.fill(word)
    assert.equal(await worksheet(page).locator('.answer-line-field').count(), 2)
    assert.equal(await correction.locator('.answer-line-field').first().textContent(), word)
    assert.equal((await worksheet(page).locator('.answer-line-field').allTextContents()).includes(word), false)
    await first.fill('')
    assert.equal(await first.getAttribute('aria-invalid'), 'true')
    assert.equal(await correction.locator('.answer-line-field').first().textContent(), word)
    await first.fill(word)
    await quantity.fill('3')
    assert.equal(await correction.locator('.answer-line-field').count(), 3)
    assert.equal(await correction.locator('.answer-line-field').first().textContent(), word)
    await button(page, 'Annuler').click()
    assert.equal(await correction.locator('.answer-line-field').count(), 2)
    assert.equal(await first.inputValue(), word)
    await page.close()
  }
}

async function alphaSentenceOrder(context) {
  const config = { domain: 'alphabetisation', topic: 'alpha-phrases', exerciseType: 'alpha-phrase-le-chat-ordre-phrases' }
  const generated = await context.newPage()
  await openFiche(generated, theoryRecipe(config), false)
  assert(await worksheet(generated).locator('.phrase-order-block .phrase-bubble').first().isVisible())
  await generated.close()

  const page = await context.newPage()
  const data = theoryRecipe({
    ...config, count: 1,
    libreItems: [{ layout: 'order', sequence: ['dort', 'chat', 'Le'], placeParts: ['Le', 'chat', 'dort'], answer: 'Le chat dort' }],
  })
  data.printCorrections = true
  await openFiche(page, data, false)
  const panel = page.locator('#activity-editor')
  const words = worksheet(page).locator('.phrase-bubble')
  const correction = page.locator('.print-only-sheets .worksheet-sheet').last()
  assert.deepEqual(await words.allTextContents(), ['dort', 'chat', 'Le'])
  assert.equal(await panel.getByLabel(/^Catégorie du mot/).count(), 0)
  await panel.getByRole('textbox', { name: 'Mot 1 de la phrase 1', exact: true }).fill('lit')
  await button(panel, 'Monter le mot').nth(1).click()
  assert.deepEqual(await words.allTextContents(), ['chat', 'lit', 'Le'])
  assert(await button(panel, 'Corrigé vérifié').isDisabled())
  await panel.getByRole('textbox', { name: 'Phrase correcte 1', exact: true }).fill('Le chat lit.')
  await button(panel, 'Corrigé vérifié').click()
  assert.equal(await correction.locator('.phrase-slot-answer').first().textContent(), 'Le chat lit.')
  assert.equal(await worksheet(page).locator('.phrase-slot-answer').count(), 0)
  await panel.getByRole('spinbutton', { name: 'Nombre de phrases', exact: true }).fill('2')
  assert.equal(await worksheet(page).locator('.phrase-order-block').count(), 2)
  assert.equal(await correction.locator('.phrase-slot-answer').first().textContent(), 'Le chat lit.')
  await button(page, 'Annuler').click()
  assert.equal(await worksheet(page).locator('.phrase-order-block').count(), 1)
  await page.close()
}

async function alphaWordGrids(context) {
  const reading = await context.newPage()
  await openFiche(reading, theoryRecipe({
    domain: 'alphabetisation', topic: 'alpha-mots', exerciseType: 'alpha-mots-outils-lire-grille', count: 2,
  }), false)
  const settings = reading.locator('#activity-editor')
  const firstGrid = settings.getByRole('group', { name: 'Grille 1', exact: true })
  await firstGrid.getByRole('textbox', { name: 'Case 1', exact: true }).fill('aujourd’hui')
  await firstGrid.getByRole('textbox', { name: 'Titre de la grille', exact: true }).fill('Mots pour lire une histoire')
  await firstGrid.getByRole('combobox', { name: 'Écriture de la grille', exact: true }).selectOption('cursive')
  await firstGrid.getByRole('combobox', { name: 'Colonnes de la grille', exact: true }).selectOption('4')
  const grids = worksheet(reading).locator('.letter-grid-block')
  assert.match(await grids.first().innerText(), /Mots pour lire une histoire.*aujourd’hui/s)
  assert.match(await grids.first().locator('.letter-cell').first().evaluate((cell) => getComputedStyle(cell).fontFamily), /Calli Playwrite/)
  assert.match(await grids.first().locator('.letter-grid').getAttribute('style'), /repeat\(4,/)
  await settings.getByRole('spinbutton', { name: 'Nombre de grilles', exact: true }).fill('3')
  assert.equal(await grids.count(), 3)
  assert.equal(await firstGrid.getByRole('textbox', { name: 'Case 1', exact: true }).inputValue(), 'aujourd’hui')
  await button(firstGrid, 'Majuscules').click()
  assert.equal(await grids.first().locator('.letter-cell').first().textContent(), 'AUJOURD’HUI')
  assert.equal(await reading.locator('.print-only-sheets .letter-cell.selected').count(), 0)
  await reading.close()

  const cursive = await context.newPage()
  await openFiche(cursive, theoryRecipe({
    domain: 'alphabetisation', topic: 'alpha-syllabes', exerciseType: 'alpha-syll-a-lire-cursive',
    libreItems: [{ layout: 'letter-grid', options: ['ma', 'pa'], labels: ['ma', 'pa'], answer: 'ma · pa' }],
  }), false)
  const cursiveGrid = worksheet(cursive).locator('.letter-grid-block')
  assert.match(await cursiveGrid.getAttribute('class'), /is-cursive/)
  await cursive.locator('#activity-editor').getByRole('combobox', { name: 'Écriture de la grille', exact: true }).selectOption('script')
  assert.doesNotMatch(await cursiveGrid.getAttribute('class'), /is-cursive/)
  await button(cursive, 'Annuler').click()
  assert.match(await cursiveGrid.getAttribute('class'), /is-cursive/)
  await cursive.close()

  const circle = await context.newPage()
  const data = theoryRecipe({
    domain: 'alphabetisation', topic: 'alpha-phrases', exerciseType: 'alpha-phrase-le-chat-entourer',
  })
  data.printCorrections = true
  await openFiche(circle, data, false)
  const panel = circle.locator('#activity-editor')
  await panel.getByRole('textbox', { name: 'Mot ou syllabe à entourer', exact: true }).fill('maison')
  const printed = circle.locator('.print-only-sheets .letter-grid-block')
  assert.match(await printed.first().textContent(), /Entourez « maison »/)
  assert.equal(await printed.first().locator('.letter-cell.selected').count(), 0)
  const cells = await printed.last().locator('.letter-cell').allTextContents()
  const targets = cells.flatMap((word, index) => word.toLowerCase() === 'maison' ? [index] : [])
  assert(targets.length >= 2)
  for (const position of targets.slice(0, -1)) {
    await panel.getByRole('textbox', { name: `Case ${position + 1}`, exact: true }).fill('coquillage')
  }
  const lastTarget = panel.getByRole('textbox', { name: `Case ${targets.at(-1) + 1}`, exact: true })
  await lastTarget.fill('verger')
  assert.equal(await lastTarget.getAttribute('aria-invalid'), 'true')
  assert.deepEqual(await printed.last().locator('.letter-cell.selected').allTextContents(), ['maison'])
  await circle.close()
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
  const doubleA5 = await context.newPage()
  await doubleA5Document(doubleA5)
  await doubleA5.close()
  const qcmPage = await context.newPage()
  await qcmPilot(qcmPage)
  await qcmPage.close()
  const audioPage = await context.newPage()
  await audioGroups(audioPage)
  await audioPage.close()
  await writing(await context.newPage())
  await pictureRecognition(await context.newPage())
  await formAndOral(context)
  await worksheetImage(await context.newPage())
  await removeTheoryParts(context)
  await alphaStoryReading(context)
  await alphaDictation(context)
  await alphaSentenceOrder(context)
  await alphaWordGrids(context)
  await context.close()
  console.log('Document partagé, QCM illustré, liaison audio, reconnaissance d’images, formulaire, oral, retrait en théorie, lecture, dictées, ordre des phrases et grilles vérifiés.')
} finally {
  await browser?.close()
  await server?.close()
}
