import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { createServer } from 'vite'
const vite = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
try {
  const { tcfObjectPool: pool, tcfObjectTranscription: transcript, tcfObjectImages: catalog } = await vite.ssrLoadModule('/src/tcf/object-pool.ts')
  const { tcfAudioEntries, tcfObjetAudioEntries } = await vite.ssrLoadModule('/src/tcf/audio-bank.ts')
  const { tcfBankAllLevels } = await vite.ssrLoadModule('/src/tcf/loader.ts')
  const { drawObjetsCompose } = await vite.ssrLoadModule('/src/tcf/draw-series.ts')
  const { createRng } = await vite.ssrLoadModule('/src/math/rng.ts')
  const { tcfExerciseItems } = await vite.ssrLoadModule('/src/tcf/generate.ts')
  const manifest = new Map(JSON.parse(readFileSync('docs/tcf/images-generees.json')).images.map((r) => [r.path, r]))
  for (const object of catalog) {
    const approved = manifest.get(object.image)
    assert.equal(approved.status, 'visually_reviewed')
    assert.equal(object.sha256, approved.sha256)
    assert.equal(createHash('sha256').update(readFileSync(`public${object.image}`)).digest('hex'), object.sha256)
  }
  for (const object of catalog) for (const variant of object.variants ?? []) {
    assert.equal(variant.sha256, manifest.get(variant.image).sha256)
    assert.equal(createHash('sha256').update(readFileSync(`public${variant.image}`)).digest('hex'), variant.sha256)
  }
  assert.ok(pool('Un téléphone fixe, un vélo et un livre.').heard.find((o) => o.id === 'telephone').image.includes('telephone-fixe'))
  assert.equal(pool('Un vélo et une voiture.'), undefined, 'two nouns cannot qualify')
  assert.equal(pool('Un vélo, des vélos et une bicyclette, une voiture.'), undefined, 'synonyms count once')
  assert.equal(pool('Je suis en train de lire. Un vélo et une voiture.'), undefined)
  assert.equal(pool('Il téléphone. Un vélo et une voiture.'), undefined)
  assert.equal(pool('Elle lit et il montre. Un vélo et une voiture.'), undefined)
  assert.equal(pool('Une brosse à dents et une pomme de terre.'), undefined, 'compound noun cannot create multiple objects')
  assert.equal(pool('Une clé et un portefeuille.'), undefined, 'whole words only')
  assert.ok(pool('Une lettre à mon ami, un livre et un stylo.'))
  assert.equal(pool('La lettre A, un livre et un stylo.'), undefined)
  const negated = pool('Je n’ai pas de voiture. Je prends mon vélo et mon téléphone.')
  assert.ok(negated?.heard.some((o) => o.id === 'voiture'), 'lexical recognition includes negation')
  const many = pool('Un vélo, un livre, un crayon, un cahier et un ordinateur.')
  assert.equal(many.heard.length, 5)
  assert.ok(many.absent.every((o) => !many.heard.some((h) => h.id === o.id || h.image === o.image)))
  const multi = { support: { audios: ['a', 'b'], transcription: ['Un vélo et une voiture.', 'Un vélo, un livre et une gomme.'] } }
  assert.equal(pool(transcript(multi, 'a')), undefined)
  assert.ok(pool(transcript(multi, 'b')))
  assert.equal(transcript({ support: { audios: ['a', 'b'], transcription: 'Un vélo, un livre et une gomme.' } }, 'a'), '')
  const bank = tcfBankAllLevels('CO')
  const original = JSON.stringify(bank)
  const entries = tcfAudioEntries(bank)
  const eligible = tcfObjetAudioEntries(bank)
  assert.ok(eligible.length > 26, 'eligibility extends beyond the 26 historical object exercises')
  assert.ok(eligible.some((e) => e.exercise.type_exercice !== 'images_a_reconnaitre'))
  const orders = new Set()
  for (const entry of eligible) {
    assert.ok(entry.objectPool.heard.length >= 3)
    const baseTags = entry.tags.filter((t) => t !== 'objet')
    if (entry.exercise.type_exercice === 'complet') assert.ok(baseTags.length > 0)
    for (let seed = 1; seed <= 1; seed++) {
      const draw = drawObjetsCompose(entry.exercise.niveau, createRng(seed * 173), { audioSlots: [entry.audio] })
      assert.equal(draw.support.audio, entry.audio)
      assert.equal(draw.support.transcription, entry.objectPool.transcription)
      assert.equal(draw.images.length, 5)
      assert.equal(new Set(draw.images.map((i) => i.id)).size, 5)
      assert.equal(new Set(draw.images.map((i) => i.image)).size, 5)
      assert.equal(draw.images.filter((i) => i.correct).length, 3)
      assert.equal(draw.images.filter((i) => !i.correct).length, 2)
      for (const image of draw.images) {
        const source = image.correct ? entry.objectPool.heard : entry.objectPool.absent
        assert.ok(source.some((o) => o.image === image.image))
        if (!image.correct) assert.ok(!entry.objectPool.heard.some((o) => o.image === image.image))
      }
      assert.deepEqual(draw, drawObjetsCompose(entry.exercise.niveau, createRng(seed * 173), { audioSlots: [entry.audio] }))
    }
  }
  const entry = eligible[0]
  const drawn = drawObjetsCompose(entry.exercise.niveau, createRng(100), { audioSlots: [entry.audio] })
  for (let seed = 1; seed <= 64; seed++) {
    const items = tcfExerciseItems(drawn, createRng(seed * 173))
    // The renderer shuffles choices without losing the image/correctness relation.
    const rendered = items.find((i) => i.tcf?.kind === 'images_a_cocher').tcf.images
    assert.equal(rendered.filter((i) => i.correct).length, 3)
    assert.deepEqual(rendered.map((i) => [i.id, i.image, i.correct]).sort(), drawn.images.map((i) => [i.id, i.image, i.correct]).sort())
    orders.add(rendered.map((i) => i.id).join(','))
  }
  assert.ok(orders.size > 20, 'refresh seeds vary image positions')
  assert.equal(JSON.stringify(bank), original, 'historical sources stay unchanged')
  const report = { date: '2026-11-07', source_hash_encoding: 'UTF-8 raw transcription', catalog_concepts: catalog.length, unique_audio_entries: entries.length, eligible_audio_entries: eligible.length, eligibility: 'At least 3 distinct illustrated noun concepts in the exact track transcript; all named concepts excluded from the 2 NO distractors.', draw: '3 OUI / 2 NON; five shuffled positions, stable object IDs', limitation: 'Conservative curated lexical catalog; unsupported or ambiguous nouns do not qualify. Source transcript review is not human audio listening.', entries: eligible.map((e) => ({ audio: e.audio, exercise: e.exercise.id, source_sha256: createHash('sha256').update(e.objectPool.transcription).digest('hex'), tags: e.tags, heard: e.objectPool.heard.map((o) => ({ id: o.id, image: o.image })) })) }
  assert.deepEqual(JSON.parse(readFileSync('src/tcf/object-images.json', 'utf8')), catalog, 'catalog must remain unchanged during the audit')
  if (process.argv.includes('--write-report')) writeFileSync('docs/tcf/objets-tirage-20261107.json', JSON.stringify(report, null, 2) + '\n')
  console.log(`${catalog.length} concepts illustrés ; ${eligible.length}/${entries.length} audios éligibles ; 3 OUI/2 NON, sources et mélange vérifiés.`)
} finally { await vite.close() }
