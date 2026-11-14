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
const vite = await createServer({ cacheDir: '/tmp/clairfle-association-20261114-vite', server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
try {
  const { associationThemedDecoyImages: decoys } = await vite.ssrLoadModule('/src/tcf/association-image-themes.ts')
  const { drawAssociationCompose } = await vite.ssrLoadModule('/src/tcf/draw-series.ts')
  const { tcfBankAllLevels } = await vite.ssrLoadModule('/src/tcf/loader.ts')
  const { tcfScenarioAudioEntries, tcfAudioEntries, applyAssociationDialogueSlot } = await vite.ssrLoadModule('/src/tcf/audio-bank.ts')
  const { createRng } = await vite.ssrLoadModule('/src/math/rng.ts')
  const bank = tcfBankAllLevels('CO')
  const original = JSON.stringify(bank)
  for (const source of catalog.sources) {
    const ex = bank.find((e) => e.id === source.exercise)
    assert.equal(ex.support.audio ?? ex.support.audios[source.dialogue - 1], source.audio)
    assert.equal(Array.isArray(ex.support.transcription) ? ex.support.transcription[source.dialogue - 1] : ex.support.transcription, source.transcription)
    assert.equal(sha(source.transcription), source.sourceSha256)
    if (ex.type_exercice === 'association_images') assert.equal(ex.situations.find((s) => s.dialogue === source.dialogue).image, source.image)
    else assert.equal(ex.type_exercice, 'complet')
    assert.ok(source.sceneKey)
    if (source.audioSha256) assert.equal(sha(readFileSync(`public${source.audio}`)), source.audioSha256)
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
      assert.ok(!sources.some((s) => s.sceneKey === row.sceneKey), image)
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
      assert.equal(new Set(sources.map((s) => s.sceneKey)).size, 4, 'Two interchangeable scenes cannot compete')
      for (const s of drawn.situations.filter((s) => s.dialogue != null)) assert.equal(s.image, sources[s.dialogue - 1].image)
      verify(sources, images)
      assert.deepEqual(drawn, drawAssociationCompose(level, createRng(seed * 173)))
      success++
    }
    assert.equal(success, 200, `${level}: ${success}/200`)
    draws.set(level, success)
  }
  const review = read('docs/tcf/scenarios-audio-20261114.json')
  const entries = tcfScenarioAudioEntries(bank)
  assert.deepEqual(new Set(entries.map((e) => e.audio)), new Set(catalog.sources.map((s) => s.audio)))
  assert.equal(review.supports.length, 346)
  let eligible = 0, bound = 0
  for (const record of review.supports) {
    const ex = bank.find((e) => e.id === record.exercise)
    assert.equal(ex.support.audio, record.audio)
    assert.equal(ex.support.transcription, record.transcription)
    assert.equal(sha(record.transcription), record.sourceSha256)
    assert.equal(sha(readFileSync(`public${record.audio}`)), record.audioSha256)
    if (record.decision.startsWith('eligible_')) {
      eligible++
      assert.ok(words(record.transcription).includes(words(record.evidenceQuote)))
      assert.ok(record.reason)
    }
    if (record.decision === 'eligible_bound_scene') {
      bound++
      const entry = entries.find((e) => e.audio === record.audio)
      assert.equal(entry.scenarioScene.image, record.image)
      assert.equal(entry.scenarioScene.transcription, record.transcription)
      const base = bank.find((e) => e.type_exercice === 'association_images')
      const same = base.support.audios.findIndex(audio => sourceFor(audio).sceneKey === entry.scenarioScene.sceneKey)
      const slot = same < 0 ? 0 : same
      const changed = applyAssociationDialogueSlot(base, entry, slot)
      assert.equal(changed.support.audios[slot], record.audio)
      assert.equal(changed.support.transcription[slot], record.transcription)
      assert.equal(changed.situations.find((s) => s.dialogue === slot + 1).image, record.image)
      verify(changed.support.audios.map(sourceFor), changed.situations.filter(s => s.dialogue == null).map(s => s.image))
      const modified = structuredClone(ex)
      modified.support.transcription += ' Une nouvelle précision.'
      assert.equal(tcfScenarioAudioEntries([modified]).length, 0, 'An edited source must lose its scene eligibility')
    } else assert.ok(!entries.some((e) => e.audio === record.audio), record.exercise)
  }
  assert.equal(eligible, review.summary.scenario_eligible)
  assert.equal(bound, review.summary.scenario_bound)
  assert.equal(entries.length, review.summary.total_bound)
  const generation = read('docs/tcf/generation-scenarios-20261114.json')
  assert.equal(generation.images.length, 7)
  for (const asset of generation.images) {
    const bytes = readFileSync(`public${asset.path}`)
    assert.equal(sha(bytes), asset.sha256)
    assert.equal(bytes.toString('hex', 0, 8), '89504e470d0a1a0a')
    assert.deepEqual([bytes.readUInt32BE(16), bytes.readUInt32BE(20)], [1448, 1086])
    assert.equal(sha(readFileSync(`public${asset.reference}`)), asset.reference_sha256)
    assert.equal(approved.get(asset.path).source_sha256, asset.sha256)
    assert.equal(approved.get(asset.path).style_review.reference_commit, '48a753d8d6bd095e41968b39da88dbcb331fee11')
    assert.ok(asset.visual_review)
  }
  const pending = review.supports.find((r) => r.decision === 'eligible_scene_pending')
  const pendingEntry = tcfAudioEntries([bank.find((e) => e.id === pending.exercise)])[0]
  const base = bank.find((e) => e.type_exercice === 'association_images')
  assert.equal(applyAssociationDialogueSlot(base, pendingEntry, 0), base, 'An unillustrated recording cannot inherit an unrelated scene')
  const added = entries.find((e) => e.exercise.id.startsWith('tcf-delf-actif-') && entries.some((other) => other.audio !== e.audio && other.scenarioScene.sceneKey === e.scenarioScene.sceneKey))
  assert.ok(added)
  for (const level of ['A0-A1', 'A1-A2', 'A2-B1']) {
    const pinned = drawAssociationCompose(level, createRng(923), { audioSlots: [added.audio] })
    assert.ok(pinned)
    assert.equal(pinned.support.audios[0], added.audio, 'A new scenario can be selected manually at every level')
  }
  const repeated = entries.find((e) => e.audio !== added.audio && e.scenarioScene.sceneKey === added.scenarioScene.sceneKey)
  assert.ok(repeated)
  assert.equal(drawAssociationCompose('A0-A1', createRng(9), { audioSlots: [added.audio, repeated.audio] }), null, 'Interchangeable pinned scenes must be rejected')
  assert.equal(JSON.stringify(bank), original, 'Drawing must preserve historical banks')
  console.log(`${fixed} associations, ${catalog.sources.length} sources, ${catalog.decoys.length} leurres ; ${[...draws].map(([k, v]) => `${k} ${v}/200`).join(', ')} tirages contrôlés.`)
} finally { await vite.close() }
