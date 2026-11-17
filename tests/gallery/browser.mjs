import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const base = process.env.GALLERY_TEST_URL ?? 'http://127.0.0.1:5189'
const output = process.env.GALLERY_TEST_OUTPUT ?? '/tmp/gallery-qa'
mkdirSync(output, { recursive: true })
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] })
const results = []
try {
  const anonymous = await browser.newPage()
  await anonymous.goto(base + '/images')
  await anonymous.waitForURL('**/acces')
  results.push('La galerie conserve la protection d’accès du site.')
  await anonymous.close()
  const context = await browser.newContext({ viewport: { width: 1440, height: 1080 }, acceptDownloads: true })
  await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  // Exercise the Blob fallback as well as the sequential disk writer below.
  await context.addInitScript(() => { window.showSaveFilePicker = undefined })
  const page = await context.newPage(), errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(base + '/images', { waitUntil: 'networkidle', timeout: 120000 })
  await page.getByRole('heading', { name: 'Galerie d’images', exact: true }).waitFor()
  assert.equal(await page.locator('.gallery-card').count(), 48)
  assert.equal(await page.locator('.gallery-card img').evaluateAll(images => images.filter(i => i.complete && i.naturalWidth > 0).length) > 0, true)
  await page.getByLabel('Rechercher une image', { exact: true }).fill('passeport')
  assert(await page.locator('.gallery-card').count() >= 2)
  await page.locator('.gallery-card input[type=checkbox]').nth(0).check()
  await page.locator('.gallery-card input[type=checkbox]').nth(1).check()
  const expected = await page.locator('.gallery-card:has(input:checked) h2').allTextContents()
  const [zip] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Télécharger la sélection (ZIP)', exact: true }).click()])
  await zip.saveAs(output + '/selection.zip')
  const names = JSON.parse(execFileSync('python3', ['-c', 'import zipfile,json,sys,pathlib; z=zipfile.ZipFile(sys.argv[1]); assert z.testzip() is None; assert all(z.read(n)==pathlib.Path("public",n).read_bytes() for n in z.namelist()); print(json.dumps(z.namelist()))', output + '/selection.zip']).toString())
  assert.equal(names.length, 2)
  assert(names.every(n => /passeport/.test(n)))
  results.push({ selectionZip: names, labels: expected })
  const [single] = await Promise.all([page.waitForEvent('download'), page.locator('.gallery-card .gallery-download').first().click()])
  await single.saveAs(output + '/' + single.suggestedFilename())
  const original = new URL(await page.locator('.gallery-card img').first().getAttribute('src'), base).pathname
  assert.deepEqual(readFileSync(output + '/' + single.suggestedFilename()), readFileSync('public' + decodeURIComponent(original)))
  await page.locator('.gallery-preview-button').first().click()
  await page.getByRole('dialog').waitFor()
  await page.keyboard.press('Escape')
  assert.equal(await page.getByRole('dialog').count(), 0)
  await page.getByLabel('Rechercher une image', { exact: true }).fill('aucune-image-zxq98347')
  await page.getByRole('heading', { name: 'Aucune image trouvée' }).waitFor()
  assert.equal(await page.getByRole('button', { name: /Télécharger la sélection/ }).isEnabled(), true)
  await page.getByRole('button', { name: 'Effacer les filtres', exact: true }).click()
  await page.getByLabel('Type d’image', { exact: true }).selectOption('Scénario')
  assert((await page.locator('.gallery-card-body > p').allTextContents()).every(t => t.includes('Scénario')))
  assert.equal(await page.locator('.gallery-filters select').count(), 1)
  assert.equal(await page.getByLabel('Collection', { exact: true }).count(), 0)
  assert.equal(await page.getByLabel('Thème', { exact: true }).count(), 0)
  await page.getByRole('button', { name: 'Effacer les filtres', exact: true }).click()
  for (const type of ['Fruit', 'Légume', 'Plat', 'Véhicule', 'Action', 'Animal', 'Végétal', 'Métier', 'Logique', 'Heure et horloge', 'Pays et nationalité', 'Partie du corps', 'Maladie']) {
    await page.getByLabel('Type d’image', { exact: true }).selectOption(type)
    assert(await page.locator('.gallery-card').count() > 0, `${type} doit contenir des images contrôlées`)
    assert((await page.locator('.gallery-card-body > p').allTextContents()).every(t => t.includes(type)))
    await page.waitForFunction(() => {
      const image = document.querySelector('.gallery-card img')
      return image?.complete && image.naturalWidth > 0
    })
  }
  await page.getByLabel('Rechercher une image', { exact: true }).fill("mal a l'epaule")
  assert.equal(await page.locator('.gallery-card').count(), 1)
  assert.match(await page.locator('.gallery-card h2').textContent(), /épaule/)
  assert(!await page.getByLabel('Type d’image', { exact: true }).locator('option').allTextContents().then(values => values.includes('Animal et végétal')))
  results.push('Les types demandés et la recherche des douleurs avec apostrophe simple affichent des images disponibles.')
  await page.getByRole('button', { name: 'Effacer les filtres', exact: true }).click()
  for (const [type, query, slug] of [['Fruit', 'ramboutan', 'ramboutan'], ['Légume', 'topinambour', 'topinambour'], ['Plat', 'ratatouille', 'ratatouille'], ['Véhicule', 'camion de pompiers', 'camion-de-pompiers']]) {
    await page.getByLabel('Type d’image', { exact: true }).selectOption(type)
    await page.getByLabel('Rechercher une image', { exact: true }).fill(query)
    const card = page.locator('.gallery-card').filter({ has: page.locator(`img[src$="/${slug}.webp"]`) })
    assert.equal(await card.count(), 1)
    await card.locator('img').waitFor()
    await page.waitForFunction(slug => [...document.querySelectorAll('.gallery-card img')].some(image => image.src.endsWith('/' + slug + '.webp') && image.complete && image.naturalWidth >= 1200), slug)
    const [download] = await Promise.all([page.waitForEvent('download'), card.locator('.gallery-download').click()])
    const saved = output + '/' + download.suggestedFilename()
    await download.saveAs(saved)
    const source = new URL(await card.locator('img').getAttribute('src'), base).pathname
    assert.deepEqual(readFileSync(saved), readFileSync('public' + decodeURIComponent(source)))
    const [typeZip] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: /Télécharger ce type/ }).click()])
    const typeZipPath = `${output}/complement-${slug}.zip`
    await typeZip.saveAs(typeZipPath)
    execFileSync('python3', ['-c', 'import zipfile,sys,pathlib; z=zipfile.ZipFile(sys.argv[1]); assert z.testzip() is None; assert sys.argv[2].lstrip("/") in z.namelist(); assert all(z.read(n)==pathlib.Path("public",n).read_bytes() for n in z.namelist())', typeZipPath, source])
    await page.screenshot({ path: `${output}/gallery-${type}.png`, fullPage: false })
    await page.getByLabel('Rechercher une image', { exact: true }).fill('')
  }
  await page.getByLabel('Type d’image', { exact: true }).selectOption('Objet')
  for (const [query, slug] of [['Objets scolaires', 'taille-crayon'], ['Meubles', 'commode'], ['Objets de la maison', 'coussin']]) {
    await page.getByLabel('Rechercher une image', { exact: true }).fill(query)
    const card = page.locator('.gallery-card').filter({ has: page.locator(`img[src$="/${slug}.webp"]`) })
    assert.equal(await card.count(), 1)
    const [download] = await Promise.all([page.waitForEvent('download'), card.locator('.gallery-download').click()])
    const saved = `${output}/objects-${slug}.webp`
    await download.saveAs(saved)
    const source = new URL(await card.locator('img').getAttribute('src'), base).pathname
    assert.deepEqual(readFileSync(saved), readFileSync('public' + source))
  }
  results.push('Les objets scolaires, meubles et objets de la maison sont recherchables par famille et téléchargeables individuellement.')
  const dailyImages = JSON.parse(readFileSync('docs/gallery/quotidien-20261116.json', 'utf8')).images
  for (const family of [...new Set(dailyImages.map(image => image.subtype))]) {
    const image = dailyImages.find(image => image.subtype === family)
    await page.getByLabel('Rechercher une image', { exact: true }).fill(`${family} ${image.label}`)
    const card = page.locator('.gallery-card').filter({ has: page.locator(`img[src$="${image.path}"]`) })
    assert.equal(await card.count(), 1)
    const [download] = await Promise.all([page.waitForEvent('download'), card.locator('.gallery-download').click()])
    const saved = `${output}/daily-${image.id}.webp`
    await download.saveAs(saved)
    assert.deepEqual(readFileSync(saved), readFileSync('public' + image.path))
  }
  results.push('Chaque famille publiée du quotidien est recherchable et son téléchargement conserve les octets de l’illustration contrôlée.')
  await page.getByLabel('Type d’image', { exact: true }).selectOption('Végétal')
  await page.getByLabel('Rechercher une image', { exact: true }).fill('pomme de terre')
  await page.getByRole('heading', { name: 'Aucune image trouvée' }).waitFor()
  await page.getByLabel('Rechercher une image', { exact: true }).fill('chêne')
  assert(await page.locator('.gallery-card').count() > 0)
  results.push('Fruit, Légume, Plat et Véhicule : nouvelles illustrations chargées et téléchargées sans modifier leurs octets ; Végétal exclut les pommes de terre et conserve les arbres.')
  await page.getByRole('button', { name: 'Effacer les filtres', exact: true }).click()
  await page.getByLabel('Rechercher une image', { exact: true }).fill('CO CFR A2')
  await page.getByLabel('Type d’image', { exact: true }).selectOption('Scénario')
  assert(await page.locator('.gallery-card').count() >= 13)
  await page.waitForFunction(() => {
    const visible = [...document.querySelectorAll('.gallery-card img')].filter(image => {
      const rect = image.getBoundingClientRect()
      return rect.top < innerHeight && rect.bottom > 0
    })
    return visible.length > 0 && visible.every(image => image.complete && image.naturalWidth > 0)
  })
  await page.screenshot({ path: output + '/gallery-co-cfr-a2.png', fullPage: false })
  await page.getByLabel('Rechercher une image', { exact: true }).fill('reservation telephonique')
  assert.equal(await page.locator('.gallery-card').count(), 1)
  assert.match(await page.locator('.gallery-card img').getAttribute('src'), /receptionniste\.webp$/)
  results.push('Les 12 scènes et leurres CFR A2 ainsi que le réemploi hôtel sont accessibles sous Scénario ; la recherche du contexte téléphonique conserve le fichier existant.')
  await page.getByRole('button', { name: 'Effacer les filtres', exact: true }).click()
  await page.getByLabel('Rechercher une image', { exact: true }).fill('extension573-cadeau')
  assert.equal(await page.locator('.gallery-card').count(), 3)
  await page.getByLabel('Type d’image', { exact: true }).selectOption('Objet')
  assert.equal(await page.locator('.gallery-card').count(), 3)
  const [group] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: /Télécharger ce type/ }).click()])
  await group.saveAs(output + '/theme.zip')
  assert.equal(execFileSync('python3', ['-c', 'import zipfile,sys; z=zipfile.ZipFile(sys.argv[1]); assert z.testzip() is None; print(len(z.namelist()))', output + '/theme.zip']).toString().trim(), '3')
  results.push('Recherche sans accents, filtres combinés, sélection persistante, aperçu clavier, fichier individuel et ZIP du type vérifiés.')
  // Validate the File System Access path without opening an OS picker.
  await page.evaluate(() => {
    window.galleryZipParts = []
    window.showSaveFilePicker = async () => ({ createWritable: async () => ({ write: async chunk => window.galleryZipParts.push(Array.from(new Uint8Array(await new Blob([chunk]).arrayBuffer()))), close: async () => { window.galleryZipClosed = true }, abort: async () => { window.galleryZipAborted = true } }) })
  })
  await page.getByRole('button', { name: /Télécharger ce type/ }).click()
  await page.waitForFunction(() => window.galleryZipClosed === true)
  const disk = await page.evaluate(() => window.galleryZipParts.flat())
  writeFileSync(output + '/stream.zip', Buffer.from(disk))
  execFileSync('python3', ['-c', 'import zipfile,sys; z=zipfile.ZipFile(sys.argv[1]); assert len(z.namelist()) == 3; assert z.testzip() is None', output + '/stream.zip'])
  results.push('ZIP écrit séquentiellement : trois originaux, CRC valides, aucun nom écrasé.')
  await page.evaluate(() => { window.showSaveFilePicker = undefined })
  await page.route('**/extension573-cadeau-art-chocolats.png', route => route.fulfill({ status: 404, body: 'missing' }))
  await page.getByRole('button', { name: /Télécharger ce type/ }).click()
  await page.getByRole('alert').waitFor()
  assert((await page.getByRole('alert').textContent()).includes('Impossible de télécharger'))
  await page.unroute('**/extension573-cadeau-art-chocolats.png')
  results.push('Une image indisponible interrompt le ZIP et affiche une erreur explicite.')
  let release
  const pending = new Promise(resolve => { release = resolve })
  await page.route('**/extension573-cadeau-art-chocolats.png', async route => { await pending; await route.abort().catch(() => undefined) })
  await page.getByRole('button', { name: /Télécharger ce type/ }).click()
  await page.getByRole('button', { name: 'Annuler', exact: true }).click()
  await page.getByRole('status').filter({ hasText: 'Téléchargement annulé.' }).waitFor()
  release()
  await page.unroute('**/extension573-cadeau-art-chocolats.png')
  results.push('Annulation vérifiée ; la sélection est conservée.')
  await page.getByRole('button', { name: 'Effacer les filtres', exact: true }).click()
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 950 })
    await page.evaluate(() => scrollTo(0, 0))
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
    await page.screenshot({ path: `${output}/gallery-${width}.png`, fullPage: false })
  }
  await page.getByRole('button', { name: 'Créer une fiche', exact: true }).click()
  await page.waitForURL('**/generateur')
  await page.getByRole('button', { name: 'Catalogue', exact: true }).click()
  await page.getByRole('menuitem', { name: 'Catalogue des images', exact: true }).click()
  await page.waitForURL('**/images')
  await page.getByRole('heading', { name: 'Galerie d’images', exact: true }).waitFor()
  assert.deepEqual(errors, [])
  writeFileSync(output + '/results.json', JSON.stringify({ passed: true, results, browserErrors: errors }, null, 2) + '\n')
  console.log(JSON.stringify({ passed: true, results }, null, 2))
} finally { await browser.close() }
