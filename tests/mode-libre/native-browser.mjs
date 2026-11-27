import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { createServer } from 'vite'

const server = process.env.BASE_URL ? null : await createServer({ server: { host: '127.0.0.1', port: 0 } })
let browser
const button = (scope, name) => scope.getByRole('button', { name, exact: true })
const preview = (page) => page.locator('.a4-frame .worksheet-sheet').first()

async function open(context, data) {
  const page = await context.newPage()
  await page.addInitScript(({ printCorrections = false, ...pageConfig }) => history.replaceState({
    ...history.state,
    clairfleFiche: {
      id: 'native-fixture', name: 'Activité témoin',
      recipe: {
        version: 1, seed: 20261127, institutional: {}, evalMode: false, pointsPerQuestion: 1,
        libreMode: false, libreSnapshot: null, printCorrections,
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
