import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { createServer } from 'vite'

const server = process.env.BASE_URL ? null : await createServer({ server: { host: '127.0.0.1', port: 0 } })
let browser
const button = (scope, name) => scope.getByRole('button', { name, exact: true })
const preview = (page) => page.locator('.a4-frame .worksheet-sheet').first()

async function open(context, data) {
  const page = await context.newPage()
  await page.addInitScript((pageConfig) => history.replaceState({
    ...history.state,
    clairfleFiche: {
      id: 'native-fixture', name: 'Activité témoin',
      recipe: {
        version: 1, seed: 20261127, institutional: {}, evalMode: false, pointsPerQuestion: 1,
        libreMode: false, libreSnapshot: null,
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

  const unavailable = await open(context, {
    domain: 'soutien-fr', topic: 'soutien-consonnes-iii', exerciseType: 'soutien-x-gz-associer-image',
  })
  await unavailable.getByText('Aucun contenu disponible pour cette activité.', { exact: true }).waitFor()
  assert(await button(unavailable, 'Enregistrer').isDisabled())
  await context.close()
  console.log('Calligraphie, cartes, Gattegno et activité indisponible testés.')
} finally {
  await browser?.close()
  await server?.close()
}
