import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFileSync, statSync } from 'node:fs'
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
