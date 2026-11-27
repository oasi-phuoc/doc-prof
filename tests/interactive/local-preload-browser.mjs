import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { createServer } from 'vite'

const base = 'http://127.0.0.1:5182'
const vite = await createServer({ server: { host: '127.0.0.1', port: 5182, strictPort: true, hmr: false } })
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] })

async function setupPreload(page) {
  await page.getByRole('button', { name: /^Préparer la séance/ }).click()
  const settings = page.getByRole('dialog', { name: 'Préparer la séance', exact: true })
  await settings.locator('summary').filter({ hasText: /^Jouer sans connexion$/ }).click()
  return { settings, preload: settings.getByRole('region', { name: 'Précharger la séance', exact: true }) }
}

function testAudio() {
  const bytes = Buffer.alloc(44 + 8000 * 2)
  bytes.write('RIFF', 0); bytes.writeUInt32LE(bytes.length - 8, 4)
  bytes.write('WAVEfmt ', 8); bytes.writeUInt32LE(16, 16)
  bytes.writeUInt16LE(1, 20); bytes.writeUInt16LE(1, 22)
  bytes.writeUInt32LE(8000, 24); bytes.writeUInt32LE(16000, 28)
  bytes.writeUInt16LE(2, 32); bytes.writeUInt16LE(16, 34)
  bytes.write('data', 36); bytes.writeUInt32LE(bytes.length - 44, 40)
  return bytes
}

try {
  await vite.listen()
  const { demoRecipe } = await vite.ssrLoadModule('/src/interactive/demo.ts')
  const { convertRecipe } = await vite.ssrLoadModule('/src/interactive/domain/convert.ts')
  const { sessionAssets } = await vite.ssrLoadModule('/src/interactive/media/full-preload.ts')
  const audio = '/lib/audio/jeu-test.wav'
  const picture = '/lib/images/jeu-test.png'
  const recipe = demoRecipe()
  recipe.pages = [{ ...recipe.pages[0], count: 1, libreItems: [{ layout: 'select', prompt: 'Quel objet as-tu entendu ?', answer: 'Un livre', options: ['Un livre', 'Un sac', 'Un stylo'], optionImages: [picture], audioSrc: audio }] }]
  const files = sessionAssets(convertRecipe(recipe), { baseUrl: base })
  const allowed = new Map(files.map(file => [file.url, file.kind]))
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } })
  await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  let page = await context.newPage()
  await page.goto(base)
  const image = Buffer.from(await page.evaluate(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 2; canvas.height = 2
    return Array.from(atob(canvas.toDataURL().split(',')[1]), character => character.charCodeAt(0))
  }))
  const wav = testAudio()
  let served = true, refused = 0
  await context.route(url => allowed.has(url.href), route => {
    if (!served) { refused++; return route.abort('internetdisconnected') }
    const kind = allowed.get(route.request().url())
    return route.fulfill(kind === 'audio' ? { contentType: 'audio/wav', body: wav } : { contentType: 'image/png', body: image })
  })
  const draft = await page.evaluate(async recipe => {
    const { createLocalDraft } = await import('/src/interactive/drafts.ts')
    return createLocalDraft(recipe, 'Médias disponibles sur cet appareil')
  }, recipe)
  const address = `${base}/interactif?d=${draft}`
  await page.goto(address)
  await page.locator('.ci-launch:enabled').waitFor({ timeout: 120_000 })
  const first = await setupPreload(page)
  await first.preload.getByRole('button', { name: 'Précharger toute la séance' }).click()
  await first.preload.getByRole('status').filter({ hasText: 'Prêt à jouer sans connexion' }).waitFor()
  await first.preload.getByRole('button', { name: 'Conserver les médias sur cet appareil' }).click()
  await first.preload.getByRole('status').filter({ hasText: 'Médias conservés sur cet appareil' }).waitFor()
  await page.close()

  served = false
  page = await context.newPage()
  await page.goto(address)
  const restored = await setupPreload(page)
  await restored.preload.getByRole('button', { name: 'Utiliser les médias conservés' }).click()
  assert.ok(refused > 0, 'The media endpoints were unavailable during reopening.')
  await restored.settings.getByRole('button', { name: 'Fermer · Préparer la séance', exact: true }).click()
  await page.locator('.ci-launch:enabled').click()
  const displayed = page.locator('.ci-answer img').first()
  await displayed.waitFor()
  assert.match(await displayed.getAttribute('src'), /^blob:/)
  await displayed.evaluate(image => image.decode())
  const player = page.locator('audio')
  assert.match(await player.getAttribute('src'), /^blob:/)
  await player.evaluate(element => element.play())
  await page.waitForFunction(() => document.querySelector('audio')?.currentTime > 0)

  assert.ok(await page.evaluate(async () => {
    const { requestLocal } = await import('/src/interactive/storage.ts')
    const { loadLocalMedia } = await import('/src/interactive/media/local-preload.ts')
    const id = 'prepared-public-media'
    const row = await requestLocal('settings', 'readonly', store => store.get(id))
    await requestLocal('settings', 'readwrite', store => store.put({ ...row, savedAt: Date.now() - 8 * 86400000 }))
    const expired = (await loadLocalMedia(location.origin)) === undefined && (await requestLocal('settings', 'readonly', store => store.get(id))) === undefined
    await requestLocal('settings', 'readwrite', store => store.put(row))
    return expired
  }))

  await context.addInitScript(() => Object.defineProperty(navigator, 'onLine', { configurable: true, value: false }))
  await page.goto(address)
  await page.locator('.ci-launch:enabled').waitFor()
  const management = await setupPreload(page)
  assert.equal(await management.preload.getByRole('button', { name: 'Utiliser les médias conservés' }).count(), 0)
  await management.preload.getByRole('button', { name: 'Supprimer les médias conservés' }).click()
  await management.preload.getByRole('status').filter({ hasText: 'Les médias conservés ont été supprimés' }).waitFor()
  assert.ok(await page.evaluate(async () => {
    const { loadLocalMedia } = await import('/src/interactive/media/local-preload.ts')
    return (await loadLocalMedia(location.origin)) === undefined
  }))
  await context.close()
  console.log('Médias conservés, relus et supprimés après fermeture de l’onglet dans Chromium.')
} finally {
  await browser.close()
  await vite.close()
}
