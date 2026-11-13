import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFileSync, statSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { buildGalleryCatalog, repositoryImages } from '../../scripts/image-gallery-catalog.mjs'

test('all repository images appear once, including documents, logos and source assets', () => {
  const files = repositoryImages(process.cwd()), catalog = buildGalleryCatalog(process.cwd(), files)
  assert(catalog.length > 5700)
  assert.equal(catalog.length, files.length)
  assert.equal(new Set(catalog.map(i => i.id)).size, files.length)
  for (const image of catalog) {
    assert(image.label && image.themes.length && image.types.length && image.collection)
    assert.equal(image.bytes, statSync(image.id).size)
    assert(image.src.startsWith('/'))
  }
  assert(catalog.some(i => i.id.startsWith('docs/')))
  assert(catalog.some(i => i.id.startsWith('src/')))
  assert(catalog.some(i => i.id.includes('logos/')))
  assert.equal(catalog.find(i => i.id.endsWith('/extension573-the-feuilles.png')).label, 'Des feuilles de thé')
  assert(catalog.find(i => i.id.endsWith('/extension573-cacao.webp')).themes.includes('Alimentation et boissons'))
  assert(catalog.some(i => i.types.includes('Scénario')))
  assert.deepEqual(JSON.parse(readFileSync('src/gallery/catalog.generated.json', 'utf8')), catalog)
})

test('animal, plant, profession and illness filters preserve the actual meaning', () => {
  const catalog = buildGalleryCatalog(process.cwd())
  const find = suffix => catalog.find(image => image.id.endsWith(suffix))
  const classes = JSON.parse(readFileSync('docs/gallery/classement-tcf-20261113.json'))
  const active = image => {
    const replacement = classes.replacements.find(row => row.original === image.src)
    return replacement ? catalog.find(row => row.src === replacement.path) : image
  }
  assert(catalog.every(image => !image.types.includes('Animal et végétal')))
  assert(active(find('/animaux-ferme-compagnie/chien.webp')).types.includes('Animal'))
  assert(active(find('/fruits/avocat.webp')).types.includes('Végétal'))
  assert(!active(find('/fruits/avocat.webp')).types.includes('Métier'))
  assert(!find('/qcm-audit/co306-couleur-rose-dessine.webp').types.includes('Végétal'), 'a pink swatch is not a flower')
  assert(!find('/qcm-audit/vocab-saumon.webp').types.includes('Animal'), 'a salmon fillet is food')
  assert(!find('/animaux-ferme-compagnie/niche.webp').types.includes('Animal'), 'a kennel is not an animal')
  const lawyer = find('/qcm-audit/co306-avocat-dessine.webp')
  assert(lawyer.types.includes('Métier'))
  assert(!lawyer.types.includes('Végétal'), 'a lawyer is not an avocado')
  const devices = catalog.filter(image => /\/sante\/(?:seringue|st[eé]thoscope|thermom[eè]tre)\.webp$/.test(image.id))
  assert(devices.length > 0)
  assert(devices.every(image => !image.types.includes('Maladie')), 'medical equipment is not an illness')
})

test('gallery replacements require approved images and retain the original bytes', () => {
  const classes = JSON.parse(readFileSync('docs/gallery/classement-tcf-20261113.json'))
  const manifest = new Map(JSON.parse(readFileSync('docs/tcf/images-generees.json')).images.map(image => [image.path, image]))
  const catalog = new Map(buildGalleryCatalog(process.cwd()).map(image => [image.src, image]))
  const hash = path => createHash('sha256').update(readFileSync(`public${path}`)).digest('hex')
  for (const image of classes.images) {
    assert.equal(manifest.get(image.path)?.status, 'visually_reviewed')
    assert.equal(hash(image.path), image.sha256)
    assert(image.types.every(type => catalog.get(image.path).types.includes(type)))
  }
  for (const replacement of classes.replacements) {
    assert.equal(hash(replacement.original), replacement.original_sha256)
    assert.equal(hash(replacement.path), replacement.sha256)
    assert(catalog.get(replacement.original).types.includes('Version antérieure'))
  }
})
