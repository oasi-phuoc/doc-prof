import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFileSync, statSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { buildGalleryCatalog, repositoryImages } from '../../scripts/image-gallery-catalog.mjs'
import { gallerySubjectTypes } from '../../scripts/gallery-subject-types.mjs'

test('all repository images appear once, including documents, logos and source assets', () => {
  const files = repositoryImages(process.cwd()).filter(file => !/^(docs|scripts|tmp)\//.test(file)), catalog = buildGalleryCatalog(process.cwd(), files)
  assert(catalog.length > 5700)
  assert.equal(catalog.length, files.length)
  assert.equal(new Set(catalog.map(i => i.id)).size, files.length)
  for (const image of catalog) {
    assert(image.label && image.themes.length && image.types.length && image.collection)
    assert.equal(image.bytes, statSync(image.id).size)
    assert(image.src.startsWith('/'))
  }
  assert(!catalog.some(i => /^(docs|scripts|tmp)\//.test(i.id)))
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
  assert(active(find('/fruits/avocat.webp')).types.includes('Fruit'))
  assert(!active(find('/fruits/avocat.webp')).types.includes('Végétal'))
  assert(!active(find('/fruits/avocat.webp')).types.includes('Métier'))
  assert(!find('/qcm-audit/co306-couleur-rose-dessine.webp').types.includes('Végétal'), 'a pink swatch is not a flower')
  assert(!find('/qcm-audit/vocab-saumon.webp').types.includes('Animal'), 'a salmon fillet is food')
  assert(!find('/animaux-ferme-compagnie/niche.webp').types.includes('Animal'), 'a kennel is not an animal')
  const lawyer = find('/qcm-audit/co306-avocat-dessine.webp')
  assert(lawyer.types.includes('Métier'))
  assert(!lawyer.types.includes('Fruit'), 'a lawyer is not an avocado')
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
    // The historical manifest predates the four more specific subject types.
    assert(image.types.filter(type => !['Objet', 'Végétal'].includes(type)).every(type => catalog.get(image.path).types.includes(type)))
  }
  for (const replacement of classes.replacements) {
    assert.equal(hash(replacement.original), replacement.original_sha256)
    assert.equal(hash(replacement.path), replacement.sha256)
    assert(catalog.has(replacement.original))
    assert(!catalog.get(replacement.original).types.includes('Version antérieure'))
  }
})

test('CFR A2 situation scenes and a reviewed context reuse are searchable as scenarios', () => {
  const catalogue = new Map(buildGalleryCatalog(process.cwd()).map(image => [image.src, image]))
  const exercises = JSON.parse(readFileSync('src/tcf/content/a1-a2/co.json'))
  const scenes = exercises.filter(ex => ex.type_exercice === 'association_images').flatMap(ex => ex.situations)
  assert.equal(scenes.length, 12)
  for (const scene of scenes) {
    assert(catalogue.get(scene.image).types.includes('Scénario'))
    assert(catalogue.get(scene.image).themes.includes('CO CFR A2'))
  }
  const reuses = JSON.parse(readFileSync('docs/gallery/co-cfr-a2-reuses-20261113.json')).reuses
  for (const reuse of reuses) {
    const source = exercises.find(ex => ex.id === reuse.source_id)
    const text = Array.isArray(source.support.transcription) ? source.support.transcription[reuse.audio_index - 1] : source.support.transcription
    assert.equal(createHash('sha256').update(text).digest('hex'), reuse.transcription_sha256)
    assert.equal(createHash('sha256').update(readFileSync('public' + reuse.path)).digest('hex'), reuse.sha256)
    assert(catalogue.get(reuse.path).types.includes('Scénario'))
    assert(catalogue.get(reuse.path).types.includes('Métier'))
  }
  assert(!catalogue.get('/lib/images/tcf/qcm-audit/co834-sac-vert-dessine.webp').types.includes('Scénario'), 'a QCM object is not promoted to a whole scene')
})

test('gallery uses the requested content categories and keeps originals and logos', () => {
  const catalog = buildGalleryCatalog(process.cwd())
  const find = suffix => catalog.find(image => image.id.endsWith(suffix))
  const forbidden = ['Version antérieure', 'Logo et icône', 'Capture et référence']
  assert(catalog.every(image => image.types.every(type => !forbidden.includes(type))))
  assert(catalog.filter(image => image.id.includes('/logique/')).every(image => image.types.length === 1 && image.types[0] === 'Logique'))
  assert.deepEqual(find('/pays/suisse.webp').types, ['Pays et nationalité'])
  assert.deepEqual(find('/presenter/portugaise.webp').types, ['Pays et nationalité'])
  assert.deepEqual(find('/corps/bras.webp').types, ['Partie du corps'])
  assert.deepEqual(find('/maladies/grippe.webp').types, ['Maladie'])
  assert.deepEqual(find('/co306-horloge-0806-dessinee.webp').types, ['Heure et horloge'])
  assert(catalog.some(image => image.id.includes('logos/')))
})

test('food and vehicle types describe the illustrated subject, including ambiguous French words', () => {
  const classify = (label, types = ['Objet'], file = '/lib/images/tcf/qcm-audit/example.webp') => gallerySubjectTypes({ label, types, file })
  for (const [label, type] of [
    ['Des pommes', 'Fruit'], ['Des fruits de la passion', 'Fruit'], ['Un avocat', 'Fruit'],
    ['Des pommes de terre', 'Légume'], ['Des tomates et des courgettes', 'Légume'], ['Des lentilles alimentaires', 'Légume'],
    ['Une tarte aux pommes', 'Plat'], ['Une salade de tomates', 'Plat'], ['Des spaghetti au pesto', 'Plat'],
    ['Un bus', 'Véhicule'], ['Un vélo électrique', 'Véhicule'], ['Un camion de pompiers', 'Véhicule'],
    ['Une rose (fleur)', 'Végétal'], ['Des feuilles', 'Végétal'], ['Un chrysanthème', 'Végétal'],
  ]) assert.deepEqual(classify(label), [type], label)
  for (const label of ['Un billet de bus', 'Un casque de vélo', 'Une feuille de papier', 'Une feuille de PVC chauffée', 'Pêche à la ligne', 'Le vélo et la natation', 'Un avocat au tribunal']) {
    const types = label === 'Un avocat au tribunal' ? ['Métier'] : ['Objet']
    assert.deepEqual(classify(label, types), types, label)
  }
  assert.deepEqual(classify('Rose', ['Objet'], '/lib/images/tcf/qcm-audit/co306-couleur-rose-dessine.webp'), ['Objet'])
  assert.deepEqual(classify('La voiture', ['Scénario']), ['Scénario'])
  assert.deepEqual(classify('Un kiwi', ['Animal']), ['Animal'], 'the bird is not a fruit')
  assert.deepEqual(classify('Manger une pomme', ['Action']), ['Action'])
})

test('botanical category contains plants and excludes fruits, vegetables, meals and nonbotanical leaves', () => {
  const catalog = buildGalleryCatalog(process.cwd())
  const plant = catalog.filter(image => image.types.includes('Végétal'))
  assert(plant.length > 80)
  assert(plant.every(image => !image.types.some(type => ['Fruit', 'Légume', 'Plat', 'Véhicule'].includes(type))))
  assert(plant.every(image => !/feuille de (?:papier|PVC)|couleur-rose/.test(image.label + image.src)))
  for (const image of catalog.filter(image => image.types.some(type => ['Fruit', 'Légume', 'Plat', 'Véhicule'].includes(type)))) {
    assert(!image.themes.includes('Végétal'))
    assert(!image.themes.includes('Végétaux'))
    assert(!image.themes.includes('Plantes'))
  }
  for (const type of ['Fruit', 'Légume', 'Plat', 'Véhicule']) assert(catalog.some(image => image.types.includes(type)))
  assert.deepEqual(catalog.find(image => image.src.endsWith('/extension573-cadeau-roman-fleurs.png')).types, ['Objet'], 'a book with flowers stays a group of objects')
})

test('gallery complements cover every announced subject with a reviewed full-size original', () => {
  const manifest = JSON.parse(readFileSync('docs/gallery/complements-20261116.json', 'utf8'))
  const catalog = new Map(buildGalleryCatalog(process.cwd()).map(image => [image.src, image]))
  const targets = { Fruit: 60, Légume: 64, Plat: 30, Véhicule: 30 }
  for (const [type, count] of Object.entries(targets)) assert.equal(manifest.subjects.filter(subject => subject.type === type).length, count)
  assert.equal(new Set(manifest.subjects.map(subject => subject.type + ':' + subject.label)).size, 184)
  for (const subject of manifest.subjects) {
    assert(['reused', 'visually_reviewed'].includes(subject.status), `Unfinished subject: ${subject.label}`)
    assert(catalog.get(subject.path)?.types.includes(subject.type), `${subject.label}: ${subject.type}`)
    assert.equal(createHash('sha256').update(readFileSync('public' + subject.path)).digest('hex'), subject.sha256)
  }
  assert.equal(manifest.images.length, manifest.jobs.length)
  for (const image of manifest.images) {
    assert.equal(image.status, 'visually_reviewed')
    assert(image.width >= 1200 && image.height >= 900 && Math.abs(image.width / image.height - 4 / 3) < .002)
    assert(image.review_note && image.reviewer && image.prompt && image.reference_sha256 && image.source_sha256)
    assert.equal(statSync('public' + image.path).size, image.bytes)
    assert.equal(createHash('sha256').update(readFileSync('public' + image.path)).digest('hex'), image.sha256)
    assert(catalog.get(image.path)?.themes.includes('Style TCF validé'))
  }
})

test('Gattegno keeps nominal clues after food and vehicle reclassification', () => {
  const pictures = JSON.parse(readFileSync('src/francais/phrase-tcf-pictures.generated.json', 'utf8'))
  const labels = new Set(pictures.map(image => image.label))
  for (const label of ['pomme', 'avocat', 'tomate', 'pizza', 'bus', 'ramboutan', 'topinambour', 'lasagnes', 'camion de pompiers']) {
    assert(labels.has(label), `Missing illustrated Gattegno noun: ${label}`)
  }
})
