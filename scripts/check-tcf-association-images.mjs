import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { createServer } from 'vite'

const read = (path) => JSON.parse(readFileSync(path, 'utf8'))
const sha = (value) => createHash('sha256').update(value).digest('hex')
const words = (s) => ` ${s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/œ/g, 'oe').replace(/[^a-z0-9]+/g, ' ').trim()} `
const catalog = read('src/tcf/association-image-themes.json')
const approved = new Map(read('docs/tcf/images-generees.json').images.map((r) => [r.path, r]))
for (const row of [...catalog.sources, ...catalog.decoys]) {
  const hash = row.imageSha256 ?? row.sha256
  assert.equal(sha(readFileSync(`public${row.image}`)), hash)
  assert.equal(approved.get(row.image)?.sha256, hash)
  assert.equal(approved.get(row.image)?.status, 'visually_reviewed')
  assert.equal(approved.get(row.image)?.aspect_ratio, '4:3')
}
const vite = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
try {
  const { associationThemedDecoyImages: decoys } = await vite.ssrLoadModule('/src/tcf/association-image-themes.ts')
  const { drawAssociationCompose } = await vite.ssrLoadModule('/src/tcf/draw-series.ts')
  const { tcfBankAllLevels } = await vite.ssrLoadModule('/src/tcf/loader.ts')
  const { createRng } = await vite.ssrLoadModule('/src/math/rng.ts')
  const bank = tcfBankAllLevels('CO')
  const original = JSON.stringify(bank)
  for (const source of catalog.sources) {
    const ex = bank.find((e) => e.id === source.exercise)
    assert.equal(ex.support.audios[source.dialogue - 1], source.audio)
    assert.equal(ex.support.transcription[source.dialogue - 1], source.transcription)
    assert.equal(sha(source.transcription), source.sourceSha256)
    assert.equal(ex.situations.find((s) => s.dialogue === source.dialogue).image, source.image)
  }
  const sourceFor = (audio) => catalog.sources.find((s) => s.audio === audio)
  function verify(sources, images) {
    const themes = new Set(sources.flatMap((s) => s.themes))
    const text = words(sources.map((s) => s.transcription).join(' '))
    for (const image of images) {
      const row = catalog.decoys.find((d) => d.image === image)
      assert.ok(row, image)
      assert.ok(row.themes.some((t) => themes.has(t)), image)
      assert.ok(!sources.some((s) => s.image === image), image)
      assert.ok(!row.absentTerms.some((term) => text.includes(words(term))), image)
    }
  }
  let fixed = 0
  for (const ex of bank.filter((e) => e.type_exercice === 'association_images')) {
    const sources = ex.support.audios.map(sourceFor)
    assert.ok(sources.every(Boolean), ex.id)
    const images = ex.situations.filter((s) => s.dialogue == null).map((s) => s.image)
    verify(sources, images)
    assert.ok(images.every((image) => decoys(sources).includes(image)), ex.id)
    fixed++
  }
  // A changed transcript or an unknown scene cannot inherit an old approval.
  assert.deepEqual(decoys([{ ...catalog.sources[0], transcription: 'Nouvelle transcription : un café.' }]), [])
  assert.deepEqual(decoys([{ ...catalog.sources[0], image: '/unknown.png' }]), [])
  const draws = new Map()
  for (const level of ['A0-A1', 'A1-A2', 'A2-B1']) {
    let success = 0
    for (let seed = 1; seed <= 200; seed++) {
      const drawn = drawAssociationCompose(level, createRng(seed * 173))
      if (!drawn) continue
      const sources = drawn.support.audios.map(sourceFor)
      const images = drawn.situations.filter((s) => s.dialogue == null).map((s) => s.image)
      assert.equal(new Set(drawn.situations.map((s) => s.image)).size, 6)
      assert.equal(images.length, 2)
      assert.equal(new Set(drawn.support.audios).size, 4)
      for (const s of drawn.situations.filter((s) => s.dialogue != null)) assert.equal(s.image, sources[s.dialogue - 1].image)
      verify(sources, images)
      assert.deepEqual(drawn, drawAssociationCompose(level, createRng(seed * 173)))
      success++
    }
    assert.ok(success >= 190, `${level}: ${success}/200`)
    draws.set(level, success)
  }
  assert.equal(JSON.stringify(bank), original, 'Drawing must preserve historical banks')
  console.log(`${fixed} associations, ${catalog.sources.length} sources, ${catalog.decoys.length} leurres ; ${[...draws].map(([k, v]) => `${k} ${v}/200`).join(', ')} tirages contrôlés.`)
} finally { await vite.close() }
