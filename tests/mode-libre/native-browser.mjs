import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { createServer } from 'vite'

const server = process.env.BASE_URL ? null : await createServer({ server: { host: '127.0.0.1', port: 0 } })
let browser
const button = (scope, name) => scope.getByRole('button', { name, exact: true })
const preview = (page) => page.locator('.a4-frame .worksheet-sheet').first()
const tinyPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAFElEQVR4nGPU9r7DgA0wYRUdtBIAC9IBYkd6Sd0AAAAASUVORK5CYII=', 'base64')

async function open(context, data) {
  const page = await context.newPage()
  await page.addInitScript(({ printCorrections = false, sheetFormat, ...pageConfig }) => history.replaceState({
    ...history.state,
    clairfleFiche: {
      id: 'native-fixture', name: 'Activité témoin',
      recipe: {
        version: 1, seed: 20261127, institutional: {}, evalMode: false, pointsPerQuestion: 1,
        libreMode: false, libreSnapshot: null, printCorrections, sheetFormat,
        pages: [{ difficulty: 'moyen', count: 2, columns: 1, ...pageConfig }],
      },
    },
  }, ''), data)
  await page.goto('/generateur')
  await preview(page).waitFor()
  return page
}

async function toggleLive(page) {
  const text = await preview(page).innerText()
  await button(page, 'Mode libre').click()
  assert.equal(await button(page, 'Valider les changements').count(), 0)
  assert.equal(await preview(page).innerText(), text)
}

try {
  await server?.listen()
  const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:' + server.httpServer.address().port
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? '/usr/bin/chromium' })
  const context = await browser.newContext({ baseURL, viewport: { width: 1366, height: 900 } })
  await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: baseURL }])

  const calligraphy = await open(context, {
    domain: 'calligraphie', topic: 'calli-libre', exerciseType: 'calli-mots', calliText: 'école\nmaison',
  })
  await toggleLive(calligraphy)
  await calligraphy.getByRole('textbox', { name: 'Modèle 1', exact: true }).fill('atelier')
  assert.match(await preview(calligraphy).innerText(), /atelier/)
  await button(calligraphy.getByRole('group', { name: 'Taille d’écriture' }), 'Grand').click()
  assert.match(await preview(calligraphy).innerText(), /atelier/)
  await button(calligraphy, 'Fermer le mode libre').click()
  assert.match(await preview(calligraphy).innerText(), /atelier/)
  await calligraphy.close()

  const game = await open(context, {
    domain: 'jeux', topic: 'jeux-libre', exerciseType: 'jeux-vocabulaire',
    gameSource: 'libre', gameEntries: ['table', 'chaise'].map((text) => ({ text })),
  })
  await toggleLive(game)
  const cardFaces = () => game.locator('.a4-frame .worksheet-sheet').allTextContents().then((faces) => faces.join('\n'))
  await game.getByRole('textbox', { name: 'Mot carte 1', exact: true }).fill('fenêtre')
  assert.match(await cardFaces(), /fenêtre/)
  await button(game, 'Annuler').click()
  assert.match(await cardFaces(), /table/)
  await button(game, 'Rétablir').click()
  assert.match(await cardFaces(), /fenêtre/)
  await game.close()

  const phrase = await open(context, {
    domain: 'gattegno', topic: 'phrase-simple', exerciseType: 'phrase-simple-ecrire', verbGroup: 'er',
  })
  await toggleLive(phrase)
  await phrase.getByRole('textbox', { name: 'Consigne de production écrite', exact: true }).fill('Écrivez une phrase sur l’atelier.')
  assert.match(await preview(phrase).innerText(), /Écrivez une phrase sur l’atelier/)
  await phrase.close()

  for (const [domain, topic, exerciseType] of [
    ['soutien-fr', 'soutien-voyelles', 'soutien-a-mots'],
    ['alphabetisation', 'alpha-voyelles', 'alpha-a-mots'],
  ]) {
    const words = await open(context, { domain, topic, exerciseType, count: 9, columns: 3 })
    const labels = () => preview(words).locator('.vocab-card-word').allTextContents()
    const before = (await labels()).filter(Boolean)
    assert(before.length > 1)
    await toggleLive(words)
    const firstWord = words.getByRole('textbox', { name: 'Mot 1', exact: true })
    assert.equal(await firstWord.inputValue(), before[0])
    await firstWord.fill('atelier')
    assert.deepEqual((await labels()).filter(Boolean), ['atelier', ...before.slice(1)])
    await button(words, 'Annuler').click()
    assert.deepEqual((await labels()).filter(Boolean), before)
    await button(words, 'Rétablir').click()
    if (domain === 'alphabetisation') {
      await button(words.getByRole('group', { name: 'Nombre de colonnes' }), '4').click()
      await preview(words).locator('.vocab-table[style*="--vocab-cols: 4"]').waitFor({ timeout: 5000 })
      assert.deepEqual((await labels()).filter(Boolean), ['atelier', ...before.slice(1)])
      assert.equal(await preview(words).locator('.vocab-table').evaluate((node) => node.style.getPropertyValue('--vocab-cols')), '4')
    }
    const cards = preview(words).locator('.vocab-card-image')
    const neighborImage = await cards.nth(1).locator('img').evaluateAll((images) => images.map((img) => img.getAttribute('src')))
    const upload = words.locator('.soutien-mots-libre input[type=file]').first()
    await upload.setInputFiles({ name: 'mot.png', mimeType: 'image/png', buffer: tinyPng })
    await cards.first().locator('img[src^="data:image/"]').waitFor()
    assert.deepEqual(await cards.nth(1).locator('img').evaluateAll((images) => images.map((img) => img.getAttribute('src'))), neighborImage)
    await upload.setInputFiles({ name: 'mot.svg', mimeType: 'image/svg+xml', buffer: Buffer.from('<svg/>') })
    await words.getByText('Choisissez une image JPG, PNG ou WebP.', { exact: true }).waitFor()
    await button(words, 'Supprimer l’image du mot 1').click()
    assert.equal(await cards.first().locator('img').count(), 0)
    await button(words, 'Annuler').click()
    assert.equal(await cards.first().locator('img[src^="data:image/"]').count(), 1)
    await button(words, 'Fermer le mode libre').click()
    assert.deepEqual((await labels()).filter(Boolean), ['atelier', ...before.slice(1)])
    await words.close()
  }

  const completion = await open(context, {
    domain: 'soutien-fr', topic: 'soutien-voyelles', exerciseType: 'soutien-a-completer',
  })
  await toggleLive(completion)
  await completion.getByRole('textbox', { name: 'Mot 1', exact: true }).fill('atelier')
  await completion.getByRole('combobox', { name: 'Partie cachée du mot 1', exact: true }).selectOption('2:4')
  const firstCard = preview(completion).locator('.syllable-complete-card').first()
  assert.deepEqual(await firstCard.locator('.syllable-complete-affix').allTextContents(), ['at', 'ier'])
  assert.equal((await firstCard.locator('.syllable-complete-blank').textContent()).trim(), '')
  await completion.getByRole('textbox', { name: 'Nouveau mot libre', exact: true }).pressSequentially('campagne')
  await button(completion, 'Ajouter le mot').click()
  assert.equal(await completion.getByRole('combobox', { name: 'Partie cachée du mot 3', exact: true }).inputValue(), '0:2')
  await completion.close()

  const order = await open(context, {
    domain: 'soutien-fr', topic: 'soutien-voyelles', exerciseType: 'soutien-a-ordre',
  })
  await toggleLive(order)
  const firstPhrase = order.locator('#activity-editor .phrase-libre-card').first()
  const tokens = firstPhrase.getByRole('textbox', { name: /^Mot \d+ de la phrase 1$/ })
  await tokens.first().fill('atelier')
  assert.match(await preview(order).innerText(), /atelier/)
  const verified = button(firstPhrase, 'Corrigé vérifié')
  assert(await verified.isDisabled())
  const words = await tokens.evaluateAll((fields) => fields.map((field) => field.value))
  await firstPhrase.getByRole('textbox', { name: 'Phrase correcte 1', exact: true }).fill(words.join(' '))
  await verified.click()
  assert.equal(await verified.count(), 0)
  await order.close()

  const letters = await open(context, {
    domain: 'alphabetisation', topic: 'alpha-voyelles', exerciseType: 'alpha-a-lettres-maj', count: 2,
  })
  const letterCells = preview(letters).locator('.letter-table-cell')
  const initialLetters = await letterCells.allTextContents()
  const changedCell = initialLetters.findIndex((letter) => letter !== 'A')
  assert(changedCell >= 0)
  await toggleLive(letters)
  const letterInput = letters.getByRole('textbox', { name: `Case ${changedCell + 1}`, exact: true })
  await letterInput.fill('12')
  assert.equal(await letterInput.getAttribute('aria-invalid'), 'true')
  assert.deepEqual(await letterCells.allTextContents(), initialLetters)
  await letterInput.fill('a')
  assert.equal(await letterCells.nth(changedCell).textContent(), 'A')
  assert.equal(await preview(letters).locator('.letter-table-cell.selected').count(), 0)
  await button(letters, 'Fiche élève (cliquer pour corrigé)').click()
  assert.match(await letterCells.nth(changedCell).getAttribute('class'), /selected/)
  await letters.getByRole('spinbutton', { name: 'Nombre de lignes', exact: true }).fill('3')
  assert.equal(await letterCells.count(), 24)
  assert.equal(await letterCells.nth(changedCell).textContent(), 'A')
  await letters.close()

  const lettersA5 = await open(context, {
    domain: 'alphabetisation', topic: 'alpha-voyelles', exerciseType: 'alpha-a-lettres-maj', count: 2,
    contentSeedTwin: 62, sheetFormat: 'a5-double-landscape',
  })
  const cellsA5 = (half) => preview(lettersA5).locator(`.a5-half.is-${half} .letter-table-cell`)
  const leftLetters = await cellsA5('left').allTextContents()
  const oldRightLetter = await cellsA5('right').first().textContent()
  await toggleLive(lettersA5)
  await button(lettersA5, 'Droite').click()
  const letter = oldRightLetter === 'Z' ? 'W' : 'Z'
  await lettersA5.getByRole('textbox', { name: 'Case 1', exact: true }).fill(letter)
  assert.deepEqual(await cellsA5('left').allTextContents(), leftLetters)
  assert.equal(await cellsA5('right').first().textContent(), letter)
  await lettersA5.getByRole('spinbutton', { name: 'Nombre de lignes', exact: true }).fill('3')
  assert.equal(await cellsA5('left').count(), 24)
  assert.equal(await cellsA5('right').count(), 24)
  assert.equal(await cellsA5('right').first().textContent(), letter)
  await lettersA5.close()

  const syllables = await open(context, {
    domain: 'soutien-fr', topic: 'soutien-voyelles', exerciseType: 'soutien-a-syllabes', count: 2,
  })
  await toggleLive(syllables)
  await syllables.getByRole('textbox', { name: 'Case 1', exact: true }).fill('tra')
  assert.deepEqual(await preview(syllables).locator('.syllable-table').evaluateAll((tables) =>
    tables.map((table) => table.querySelector('.syllable-table-cell').textContent)), ['tra', 'tra'])
  await syllables.close()

  const logic = await open(context, {
    domain: 'logique', topic: 'logique-suite-graphique', exerciseType: 'logique-suite-graphique',
  })
  await toggleLive(logic)
  const puzzle = preview(logic).locator('.logique-block').first()
  const beforePuzzle = await puzzle.locator('.logique-stem img').first().getAttribute('src')
  const logicQuestion = logic.getByRole('group', { name: 'Question 1', exact: true })
  const bank = logicQuestion.getByRole('combobox', { name: 'Question de la banque', exact: true })
  const currentId = await bank.inputValue()
  const nextId = await bank.locator('option').evaluateAll((options, current) =>
    options.find(({ value }) => value && value !== current).value, currentId)
  await bank.selectOption(nextId)
  const changedPuzzle = await puzzle.locator('.logique-stem img').first().getAttribute('src')
  assert.notEqual(changedPuzzle, beforePuzzle)
  const correctionChoice = logicQuestion.getByRole('combobox', { name: 'Bonne réponse', exact: true })
  await correctionChoice.selectOption('1')
  assert.equal(await puzzle.locator('.logique-choice.is-answer').count(), 0)
  await button(logic, 'Fiche élève (cliquer pour corrigé)').click()
  assert.match(await puzzle.locator('.logique-choice.is-answer').innerText(), /B\./)
  await button(logicQuestion, 'Verrou de la question 1').click()
  await button(logic, 'Régénérer les questions déverrouillées').click()
  assert.equal(await bank.inputValue(), nextId)
  assert.equal(await puzzle.locator('.logique-stem img').first().getAttribute('src'), changedPuzzle)
  await logic.close()

  const logicA5 = await open(context, {
    domain: 'logique', topic: 'logique-suite-graphique', exerciseType: 'logique-suite-graphique',
    contentSeedTwin: 62, sheetFormat: 'a5-double-landscape',
  })
  const scene = (half) => preview(logicA5).locator(`.a5-half.is-${half} .logique-stem img`).first().getAttribute('src')
  const leftScene = await scene('left')
  const rightScene = await scene('right')
  await toggleLive(logicA5)
  await button(logicA5, 'Droite').click()
  const rightBank = logicA5.getByRole('combobox', { name: 'Question de la banque', exact: true }).first()
  const bankId = await rightBank.inputValue()
  const otherBankId = await rightBank.locator('option').evaluateAll((options, current) =>
    options.find(({ value }) => value && value !== current).value, bankId)
  await rightBank.selectOption(otherBankId)
  assert.equal(await scene('left'), leftScene)
  assert.notEqual(await scene('right'), rightScene)
  await logicA5.close()

  const coordinates = await open(context, {
    domain: 'géométrie', topic: 'reperage', exerciseType: 'reperage-droites', count: 3,
  })
  const axes = preview(coordinates).locator('svg.coord-grid.scene-axes')
  const linesBefore = await axes.locator('line.coord-line').evaluateAll((lines) => lines.map((line) => line.outerHTML))
  assert(linesBefore.length > 0)
  await toggleLive(coordinates)
  assert.equal(await coordinates.locator('#activity-editor .coord-questions-libre').count(), 1)
  await coordinates.getByRole('textbox', { name: 'Énoncé de la question 1', exact: true }).fill('Observez la première droite.')
  await coordinates.getByRole('textbox', { name: 'Réponse de la question 1', exact: true }).fill('Elle est horizontale.')
  assert.match(await preview(coordinates).innerText(), /Observez la première droite/)
  assert.doesNotMatch(await preview(coordinates).innerText(), /Elle est horizontale/)
  assert.deepEqual(await axes.locator('line.coord-line').evaluateAll((lines) => lines.map((line) => line.outerHTML)), linesBefore)
  await button(coordinates, 'Corrigé vérifié').click()
  await button(coordinates, 'Fiche élève (cliquer pour corrigé)').click()
  assert.match(await preview(coordinates).innerText(), /Elle est horizontale/)
  await coordinates.emulateMedia({ media: 'print' })
  const measured = await coordinates.locator('.print-only-sheets svg.coord-grid.scene-axes').first().evaluate((svg) => ({
    writtenMm: Number.parseFloat(svg.getAttribute('width')),
    renderedMm: svg.getBoundingClientRect().width * 25.4 / 96,
  }))
  assert(Math.abs(measured.writtenMm - measured.renderedMm) < 0.6)
  await coordinates.close()

  const theory = await open(context, {
    domain: 'grammaire', topic: 'gram-entrer-contact', exerciseType: 'gram-b1-theorie',
  })
  const printedTheory = theory.locator('.print-only-sheets .worksheet-sheet')
  const originalTheory = await printedTheory.allTextContents()
  assert.equal(originalTheory.length, 2)
  await toggleLive(theory)
  assert.deepEqual(await printedTheory.allTextContents(), originalTheory)
  const theoryEditor = theory.getByLabel('Contenu de la théorie', { exact: true })
  await theoryEditor.getByRole('textbox', { name: 'Titre', exact: true }).fill('Choisir une formule de politesse')
  assert.match(await preview(theory).innerText(), /Choisir une formule de politesse/)
  await theoryEditor.locator(':scope > details > summary').filter({ hasText: /^Section / }).last().click()
  await theoryEditor.locator('summary').filter({ hasText: /^Tableau / }).last().click()
  await theoryEditor.getByRole('textbox', { name: 'En-tête 1', exact: true }).fill('Une personne proche')
  assert.equal(await printedTheory.count(), 2)
  assert.match(await printedTheory.nth(1).textContent(), /Une personne proche/)
  await button(theory, 'Annuler').click()
  assert.equal(await printedTheory.nth(1).textContent(), originalTheory[1])
  await theory.close()

  const pronounce = await open(context, {
    domain: 'alphabetisation', topic: 'alpha-voyelles', exerciseType: 'alpha-a-syllabes-prononcer',
  })
  await toggleLive(pronounce)
  const syllableField = pronounce.getByRole('textbox', { name: 'Syllabes du mot 1', exact: true })
  const initialSyllables = await syllableField.inputValue()
  await syllableField.fill('dé-cou-page-incorrect')
  assert.equal(await syllableField.getAttribute('aria-invalid'), 'true')
  assert.equal(await syllableField.getAttribute('data-applied-value'), initialSyllables)
  await pronounce.getByRole('textbox', { name: 'Mot 1', exact: true }).fill('domino')
  const displayedSyllables = preview(pronounce).locator('.syllable-pronounce-row').first().locator('.syllable-pronounce-cell')
  assert.deepEqual(await displayedSyllables.allTextContents(), ['do', 'mi', 'no'])
  await syllableField.fill('dom-i-no')
  assert.deepEqual(await displayedSyllables.allTextContents(), ['dom', 'i', 'no'])
  await button(pronounce, 'Fermer le mode libre').click()
  assert.deepEqual(await displayedSyllables.allTextContents(), ['dom', 'i', 'no'])
  await pronounce.close()

  const pronounceA5 = await open(context, {
    domain: 'alphabetisation', topic: 'alpha-voyelles', exerciseType: 'alpha-a-syllabes-prononcer',
    sheetFormat: 'a5-double-landscape', contentSeedTwin: 191,
  })
  await toggleLive(pronounceA5)
  const leftSyllables = preview(pronounceA5).locator('.a5-half.is-left')
  const initialLeftSyllables = await leftSyllables.innerText()
  await button(pronounceA5, 'Droite').click()
  await pronounceA5.getByRole('textbox', { name: 'Mot 1', exact: true }).fill('domino')
  assert.deepEqual(await preview(pronounceA5).locator('.a5-half.is-right .syllable-pronounce-row').first()
    .locator('.syllable-pronounce-cell').allTextContents(), ['do', 'mi', 'no'])
  assert.equal(await leftSyllables.innerText(), initialLeftSyllables)
  await pronounceA5.close()

  const countSounds = await open(context, {
    domain: 'soutien-fr', topic: 'soutien-voyelles', exerciseType: 'soutien-a-compter',
  })
  await toggleLive(countSounds)
  const phraseField = countSounds.getByRole('textbox', { name: 'Phrase 1', exact: true })
  const initialPhrase = await phraseField.inputValue()
  await phraseField.fill('')
  assert.equal(await phraseField.getAttribute('aria-invalid'), 'true')
  assert.equal(await phraseField.getAttribute('data-applied-value'), initialPhrase)
  await phraseField.fill('Papa.')
  assert.match(await preview(countSounds).innerText(), /Papa\./)
  assert.equal(await countSounds.getByRole('status', { name: 'Occurrences du son pour la phrase 1', exact: true }).innerText(), '2')
  await button(countSounds, 'Fiche élève (cliquer pour corrigé)').click()
  assert.equal(await preview(countSounds).locator('.count-sound-blank').first().innerText(), '2')
  await countSounds.close()

  const determinants = await open(context, {
    domain: 'soutien-fr', topic: 'soutien-voyelles', exerciseType: 'soutien-a-determinants',
  })
  await toggleLive(determinants)
  const detRow = determinants.getByRole('group', { name: 'Phrase 1', exact: true })
  const withBlanks = detRow.getByRole('textbox', { name: 'Phrase avec des lacunes (___)', exact: true })
  const detApplied = await withBlanks.inputValue()
  await withBlanks.fill('Une phrase sans lacune.')
  assert.equal(await withBlanks.getAttribute('aria-invalid'), 'true')
  await withBlanks.fill(`À l’atelier, ${detApplied}`)
  const correction = detRow.getByRole('combobox', { name: 'Déterminant 1', exact: true })
  await correction.selectOption('les')
  assert.match(await preview(determinants).innerText(), /À l’atelier/)
  await detRow.getByText('Corrigé à vérifier', { exact: true }).waitFor()
  await button(determinants, 'Fiche élève (cliquer pour corrigé)').click()
  assert.equal(await preview(determinants).locator('.determinant-blank').first().innerText(), 'les')
  await button(detRow, 'Corrigé vérifié').click()
  await determinants.close()

  const grammar = await open(context, {
    domain: 'grammaire', topic: 'gram-present', exerciseType: 'gram-ex-etre-qcm-conj',
    grammarActivityId: 'gram-ex-etre-qcm-conj', grammarLevel: 'A1', grammarPresentation: 'choice',
    grammarBankRevision: 'etre-a1-2026-11-11.1', grammarPreview: true,
  })
  await toggleLive(grammar)
  const grammarQuestion = grammar.getByRole('group', { name: 'Question 1', exact: true })
  const grammarPrompt = grammarQuestion.getByRole('textbox', { name: 'Phrase avec une lacune (___)', exact: true })
  await grammarPrompt.fill('Cette saisie ne contient aucune lacune.')
  assert.equal(await grammarPrompt.getAttribute('aria-invalid'), 'true')
  assert.doesNotMatch(await preview(grammar).innerText(), /Cette saisie/)
  await grammarPrompt.fill('Dans cet atelier, je ___ à l’heure.')
  assert.match(await preview(grammar).innerText(), /Dans cet atelier, je/)
  await grammarQuestion.getByText('Corrigé à vérifier', { exact: true }).waitFor()
  const answer = grammarQuestion.getByRole('combobox', { name: 'Bonne réponse', exact: true })
  const correctId = await answer.inputValue()
  const choiceIndex = (await answer.locator('option').evaluateAll((options) => options.map((option) => option.value))).indexOf(correctId)
  await grammarQuestion.getByRole('textbox', { name: `Choix ${choiceIndex + 1}`, exact: true }).fill('suis bien')
  assert.equal(await answer.inputValue(), correctId)
  assert.match(await preview(grammar).innerText(), /suis bien/)
  await button(grammarQuestion, 'Corrigé vérifié').click()
  await button(grammar, 'Fermer le mode libre').click()
  assert.match(await preview(grammar).innerText(), /Dans cet atelier, je/)
  await grammar.close()

  const gradedCases = [
    { topic: 'gram-entrer-contact', subtheme: 'b1', id: 'gram-ex-b1-curriculum-a', presentation: 'match',
      revision: 'b1-a1-curriculum-a-2026-11-14.1', field: 'Droite 1', value: 'Partenaire de l’atelier' },
    { topic: 'gram-entrer-contact', subtheme: 'b2', id: 'gram-ex-b2-curriculum-o', presentation: 'order',
      revision: 'b2-a1-curriculum-o-2026-11-14.1', field: 'Élément 1 de la solution', value: 'Camarades' },
    { topic: 'gram-entrer-contact', subtheme: 'b2', id: 'gram-ex-b2-ecrire', presentation: 'open-written',
      revision: 'b2-a1-ecrire-2026-11-14.1', field: 'Tâche', value: 'Présentez votre projet à l’atelier.' },
    { topic: 'gram-entrer-contact', subtheme: 'b1', id: 'gram-ex-b1-curriculum-s', presentation: 'scenario-set',
      revision: 'b1-a1-curriculum-s-2026-11-14.1', field: 'Situation', value: 'Un échange au début de l’atelier.' },
    { topic: 'gram-présent', subtheme: 'etre', id: 'gram-ex-etre-corriger-erreur', presentation: 'correct',
      revision: 'etre-a1-2026-11-11.1', field: 'Texte à corriger', value: 'Mes collègues est à l’atelier.' },
  ]
  for (const { topic, subtheme, id, presentation, revision, field, value } of gradedCases) {
    const activity = await open(context, {
      domain: 'grammaire', topic, gramSubtheme: subtheme, exerciseType: id,
      grammarActivityId: id, grammarLevel: 'A1', grammarPresentation: presentation,
      grammarBankRevision: revision, grammarPreview: true,
    })
    await toggleLive(activity)
    const group = activity.getByRole('group', { name: 'Question 1', exact: true })
    const editor = group.getByRole('textbox', { name: field, exact: true })
    assert.notEqual(await editor.inputValue(), value, id)
    await editor.fill(value)
    assert((await preview(activity).innerText()).includes(value), id)
    assert.equal(await group.getByText('Corrigé à vérifier', { exact: true }).isVisible(), true, id)
    await button(group, 'Corrigé vérifié').click()
    await activity.close()
  }

  const document = await open(context, {
    domain: 'grammaire', topic: 'gram-se-presenter', gramSubtheme: 'a1', exerciseType: 'gram-ex-a1-ce-texte',
    grammarActivityId: 'gram-ex-a1-ce-texte', grammarLevel: 'A1', grammarPresentation: 'document-set',
    grammarBankRevision: 'a1-ce-texte-2026-11-21.1', grammarPreview: true, grammarDocumentCount: 1,
  })
  await toggleLive(document)
  const text = document.getByRole('textbox', { name: 'Texte du document', exact: true })
  const originalText = await text.inputValue()
  const addition = 'Nous nous retrouvons à l’atelier, à quinze heures.'
  await text.fill(addition)
  assert.equal(await text.getAttribute('aria-invalid'), 'true')
  await text.fill(`${originalText}\n\n${addition}`)
  assert.equal(await text.getAttribute('aria-invalid'), 'false')
  const numberOfTexts = document.getByRole('spinbutton', { name: 'Nombre de textes', exact: true })
  await numberOfTexts.fill('2')
  assert.equal(await numberOfTexts.inputValue(), '2')
  assert((await document.locator('.print-only-sheets .worksheet-sheet').allTextContents()).join('\n').includes(addition))
  await document.close()

  for (const diploma of ['afp', 'cfc']) {
    const course = await open(context, {
      domain: `logistique-${diploma}`, topic: `log-${diploma}-theme-100`,
      exerciseType: `log-${diploma}-101-theorie`, logistiqueTheoryView: 'resume',
    })
    await toggleLive(course)
    const pages = course.locator('.print-only-sheets .worksheet-sheet')
    const before = await pages.allTextContents()
    const courseEditor = course.getByLabel('Contenu de la théorie', { exact: true })
    await courseEditor.getByRole('textbox', { name: 'Titre', exact: true }).first().fill('Référence personnalisée')
    assert.match(await pages.first().textContent(), /Référence personnalisée/)
    const viewSwitch = course.getByRole('group', { name: 'Version de la théorie' })
    course.once('dialog', (dialog) => dialog.dismiss())
    await button(viewSwitch, 'Complet').click()
    assert.match(await pages.first().textContent(), /Référence personnalisée/)
    course.once('dialog', (dialog) => dialog.accept())
    await button(viewSwitch, 'Complet').click()
    await pages.nth(before.length).waitFor({ state: 'attached' })
    assert.doesNotMatch(await pages.first().textContent(), /Référence personnalisée/)
    await button(course, 'Annuler').click()
    assert.match(await pages.first().textContent(), /Référence personnalisée/)
    await button(course, 'Annuler').click()
    assert.deepEqual(await pages.allTextContents(), before)
    await course.close()

    const maths = await open(context, {
      domain: `logistique-${diploma}`, topic: `log-${diploma}-theme-100`,
      exerciseType: `log-${diploma}-101-maths`, printCorrections: true,
    })
    await toggleLive(maths)
    const question = maths.getByRole('list', { name: 'Questions', exact: true }).getByRole('listitem').first()
    await question.getByRole('textbox', { name: 'Énoncé', exact: true }).fill('Calculez la quantité pour l’atelier.')
    await question.getByRole('textbox', { name: 'Calcul du corrigé', exact: true }).fill('11 × 2 = 22')
    await question.getByRole('textbox', { name: 'Réponse', exact: true }).fill('22 palettes')
    assert.match(await preview(maths).innerText(), /Calculez la quantité pour l’atelier/)
    assert.doesNotMatch(await preview(maths).innerText(), /22 palettes/)
    await question.getByText('Corrigé à vérifier', { exact: true }).waitFor()
    await button(question, 'Corrigé vérifié').click()
    const correction = await maths.locator('.print-only-sheets .worksheet-sheet').last().textContent()
    assert.match(correction, /11 × 2 = 22/)
    assert.match(correction, /22 palettes/)
    assert(await preview(maths).locator('.draft-pad').first().isVisible())
    await maths.close()
  }

  const civics = await open(context, {
    domain: 'société', topic: 'societe-suisse', exerciseType: 'societe-suisse-ex-devoirs',
  })
  await toggleLive(civics)
  await civics.getByRole('textbox', { name: 'Énoncé', exact: true }).first().fill('Donnez un exemple de devoir civique.')
  assert.match(await preview(civics).innerText(), /Donnez un exemple de devoir civique/)
  await civics.close()

  const mathsA5 = await open(context, {
    domain: 'logistique-cfc', topic: 'log-cfc-theme-100', exerciseType: 'log-cfc-101-maths',
    sheetFormat: 'a5-double-landscape', printCorrections: true,
  })
  await toggleLive(mathsA5)
  const halfText = async (half) => (await mathsA5.locator(`.print-only-sheets .a5-half.is-${half}`).allTextContents()).join('\n')
  const leftLogistics = await halfText('left')
  await button(mathsA5, 'Droite').click()
  const rightQuestions = mathsA5.getByRole('list', { name: 'Questions', exact: true })
  const protectedQuestion = rightQuestions.getByRole('listitem').first()
  await protectedQuestion.getByRole('textbox', { name: 'Énoncé', exact: true }).fill('Calculez le nombre de colis à droite.')
  await protectedQuestion.getByRole('textbox', { name: 'Réponse', exact: true }).fill('42 colis')
  await button(protectedQuestion, 'Corrigé vérifié').click()
  await button(protectedQuestion, 'Verrou de la question 1').click()
  const replacement = rightQuestions.getByRole('listitem').nth(1)
  const replacementText = await replacement.getByRole('textbox', { name: 'Énoncé', exact: true }).inputValue()
  await button(replacement, 'Régénérer la question').click()
  assert.notEqual(await replacement.getByRole('textbox', { name: 'Énoncé', exact: true }).inputValue(), replacementText)
  assert.equal(await halfText('left'), leftLogistics)
  assert.match(await halfText('right'), /Calculez le nombre de colis à droite/)
  assert.match(await halfText('right'), /42 colis/)
  await mathsA5.close()

  const referenceA5 = await open(context, {
    domain: 'logistique-afp', topic: 'log-afp-theme-100', exerciseType: 'log-afp-101-theorie',
    logistiqueTheoryView: 'resume', sheetFormat: 'a5-double-landscape',
  })
  await toggleLive(referenceA5)
  await referenceA5.getByLabel('Contenu de la théorie', { exact: true })
    .getByRole('textbox', { name: 'Titre', exact: true }).first().fill('Logistique au quotidien')
  for (const half of ['left', 'right']) {
    assert.match(await preview(referenceA5).locator(`.a5-half.is-${half}`).innerText(), /Logistique au quotidien/)
  }
  await referenceA5.emulateMedia({ media: 'print' })
  const halves = referenceA5.locator('.print-only-sheets .a5-half')
  const measurements = await halves.evaluateAll(async (sheets) => {
    await document.fonts.ready
    await Promise.all(sheets.flatMap((sheet) => [...sheet.querySelectorAll('img')]).map((image) => image.decode()))
    return sheets.map((sheet) => {
      const body = sheet.querySelector('.sheet-body').getBoundingClientRect()
      const footer = sheet.querySelector('.doc-footer').getBoundingClientRect()
      const last = Math.max(...[...sheet.querySelectorAll('.exercise-item')].map((item) => item.getBoundingClientRect().bottom))
      return Math.min(body.bottom, footer.top) - last
    })
  })
  assert(measurements.length >= 2)
  assert(measurements.every((reserve) => reserve >= 25), JSON.stringify(measurements))
  await referenceA5.close()

  const unavailable = await open(context, {
    domain: 'soutien-fr', topic: 'soutien-consonnes-iii', exerciseType: 'soutien-x-gz-associer-image',
  })
  await unavailable.getByText('Aucun contenu disponible pour cette activité.', { exact: true }).waitFor()
  assert(await button(unavailable, 'Enregistrer').isDisabled())
  await context.close()
  console.log('Calligraphie, cartes, Gattegno, mots illustrés, mots à compléter, Grammaire, Société, Logistique AFP/CFC et activité indisponible testés.')
} finally {
  await browser?.close()
  await server?.close()
}
