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
  const { tcfImageSrc } = await vite.ssrLoadModule('/src/tcf/media.ts')
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
      const origin = sourceFor(row.sourceAudio)
      assert.ok(origin, 'A decoy must belong to another reviewed scenario recording')
      assert.equal(origin.image, image)
      assert.equal(origin.exercise, row.sourceExercise)
      assert.equal(origin.dialogue, row.sourceDialogue)
      assert.equal(origin.sourceSha256, row.sourceSha256)
      assert.equal(origin.audioSha256, row.audioSha256)
      assert.ok(origin.sceneReview.visible_interlocutors >= 2)
      assert.equal(origin.sceneReview.full_body_visible, true)
      assert.ok(!sources.some(source => source.audio === row.sourceAudio), 'A selected recording cannot supply a decoy')
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
  const genderAudit = read('docs/tcf/recontrole-genres-scenes-20261114.json')
  assert.equal(genderAudit.human_audio_listening_performed, false)
  assert.equal(genderAudit.sources.length, 39)
  assert.equal(genderAudit.summary.reviewed, 39)
  assert.equal(new Set(genderAudit.sources.map(s => s.image)).size, 33)
  assert.equal(genderAudit.summary.voices_to_confirm, genderAudit.sources.filter(s => ['roles_not_specified', 'partial_documented_match'].includes(s.gender_review_status)).length)
  for (const source of genderAudit.sources) {
    assert.notEqual(source.gender_review_status, 'to_review')
    assert.ok(source.note)
    for (const evidence of source.evidence) assert.ok(words(source.transcription).includes(words(evidence)))
    assert.equal(sha(readFileSync(`public${source.audio}`)), source.audioSha256)
    assert.equal(sha(source.transcription), source.sourceSha256)
    assert.equal(sha(readFileSync(`public${source.image}`)), source.imageSha256)
    const active = catalog.sources.find(s => s.audio === source.audio && s.exercise === source.exercise && s.dialogue === source.dialogue)
    assert.equal(active.image, source.corrected_image ?? source.image)
    assert.equal(active.genderAudit.status, source.gender_review_status)
  }
  for (const correction of genderAudit.corrections) {
    const bytes = readFileSync(`public${correction.path}`)
    assert.equal(sha(bytes), correction.sha256)
    assert.equal(bytes.toString('hex', 0, 8), '89504e470d0a1a0a')
    assert.deepEqual([bytes.readUInt32BE(16), bytes.readUInt32BE(20)], [1448, 1086])
    assert.equal(approved.get(correction.path).source_sha256, correction.sha256)
    assert.equal(sha(readFileSync(`public${correction.reference}`)), correction.reference_sha256)
    const old = genderAudit.sources.find(s => s.audio === correction.audio)
    assert.equal(old.existing_audio_recognitions.length, 2)
    for (const recognition of old.existing_audio_recognitions) {
      assert.equal(recognition.source_sha256, correction.audio_sha256)
      assert.ok(recognition.text.includes('tu es fou'))
    }
    assert.equal(tcfImageSrc(correction.previous_image), tcfImageSrc(correction.path))
    assert.equal(tcfImageSrc(`${correction.previous_image}?revision=1#test`), `${tcfImageSrc(correction.path)}?revision=1#test`)
    assert.equal(tcfImageSrc(correction.previous_image.slice('/lib/images/'.length)), tcfImageSrc(correction.path))
  }
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
  const priority = read('docs/tcf/generation-scenarios-priorite-20261114.json')
  const suite = read('docs/tcf/generation-scenarios-a2-suite-20261114.json')
  const a1Complement = read('docs/tcf/generation-scenarios-a1-complement-20261114.json')
  const a2Complement = read('docs/tcf/generation-scenarios-a2-complement-20261114.json')
  const a2Final = read('docs/tcf/generation-scenarios-a2-final-20261114.json')
  const b1Suite = read('docs/tcf/generation-scenarios-b1-suite-20261114.json')
  const b1Complement = read('docs/tcf/generation-scenarios-b1-complement-20261114.json')
  const b1Final = read('docs/tcf/generation-scenarios-b1-final-20261115.json')
  const interlocutorCorrection = read('docs/tcf/correction-interlocuteurs-pluie-20261114.json')
  const framingCorrections = read('docs/tcf/corrections-interlocuteurs-20261115.json')
  const directReview = read('docs/tcf/validation-directe-scenes-20261115.json')
  const completeDialogues = read('docs/tcf/dialogues-complets-20261115.json')
  const finalFraming = read('docs/tcf/cadrages-finaux-20261115.json')
  const audioDecoys = read('docs/tcf/leurres-audios-scenarios-20261115.json')
  const detailCorrections = read('docs/tcf/corrections-regards-porte-20261120.json')
  const userAccepted = (source, image = source?.image) => {
    if (!source) return false
    image = detailCorrections.sources.find(row => row.audio === source.audio && row.previous_image === image)?.image ?? image
    const accepted = [...directReview.sources, ...completeDialogues.sources, ...finalFraming.sources, ...detailCorrections.sources].find(row => row.audio === source.audio && row.exercise === source.exercise && row.dialogue === source.dialogue && row.image === image)
    if (!accepted) return false
    assert.equal(source.editorialReview.status, 'user_accepted')
    assert.equal(source.editorialReview.audio_listening_performed, false)
    assert.equal(accepted.image_sha256, source.imageSha256)
    assert.equal(accepted.source_sha256, source.sourceSha256)
    assert.equal(accepted.audio_sha256, source.audioSha256)
    assert.equal(accepted.transcription, source.transcription)
    return true
  }
  const expansions = [priority, suite, a1Complement, a2Complement, a2Final, b1Suite, b1Complement, interlocutorCorrection, b1Final]
  for (const asset of interlocutorCorrection.images) {
    assert.equal(asset.scene_review.visible_interlocutors, 2)
    assert.equal(tcfImageSrc(asset.previous_image), asset.path)
    assert.equal(tcfImageSrc(`${asset.previous_image}?revision=2`), `${asset.path}?revision=2`)
  }
  assert.equal(priority.human_audio_listening_performed, false)
  assert.equal(priority.images.length, priority.summary.original_pngs)
  assert.equal(new Set(priority.reuses.map((r) => r.path)).size, priority.summary.reused_images)
  // Parallel generation registers retain their original snapshots. Count the
  // union of eligible audios instead of adding overlapping batches twice.
  const readyStatuses = ['documented_roles_match', 'no_visible_character']
  const readyAudios = new Set(expansions.flatMap(batch => [...batch.images, ...batch.reuses])
    .filter(asset => readyStatuses.includes(asset.gender_review.status))
    .flatMap(asset => asset.bindings.map(binding => review.supports.find(r => r.exercise === binding.exercise).audio)))
  assert.equal(new Set([...genderAudit.sources.map(s => s.audio), ...readyAudios, ...directReview.sources.map(s => s.audio)]).size, catalog.sources.length)
  const consolidation = read('docs/tcf/consolidation-scenes-20261114.json')
  assert.equal(consolidation.summary.active_scenario_sources, catalog.sources.length)
  assert.equal(consolidation.summary.remaining_scenes, review.summary.scenario_pending)
  assert.equal(consolidation.bindings.length, catalog.sources.length)
  for (const binding of consolidation.bindings) {
    const source = catalog.sources.find(s => s.audio === binding.audio)
    assert.equal(source.image, binding.image)
    assert.equal(source.imageSha256, binding.image_sha256)
    assert.equal(source.audioSha256, binding.audio_sha256)
    assert.equal(source.sourceSha256, binding.source_sha256)
  }
  assert.equal(expansions.reduce((n, b) => n + b.images.length, generation.images.length) + framingCorrections.images.length + directReview.images.length + completeDialogues.images.length + finalFraming.images.length + detailCorrections.images.length, review.summary.new_original_pngs)
  assert.equal(priority.summary.new_scenario_audio_bindings + priority.summary.awaiting_gender_confirmation, priority.summary.prepared_scene_uses)
  assert.equal(suite.images.length, suite.summary.original_pngs)
  assert.equal(suite.summary.new_scenario_audio_bindings + suite.summary.awaiting_gender_confirmation, suite.summary.prepared_scene_uses)
  assert.equal(suite.human_audio_listening_performed, false)
  assert.equal(a1Complement.images.length, a1Complement.summary.original_pngs)
  assert.equal(a1Complement.summary.new_scenario_audio_bindings + a1Complement.summary.awaiting_gender_confirmation, a1Complement.summary.prepared_scene_uses)
  assert.equal(a1Complement.human_audio_listening_performed, false)
  assert.equal(a2Complement.images.length, a2Complement.summary.original_pngs)
  assert.equal(a2Complement.summary.new_scenario_audio_bindings + a2Complement.summary.awaiting_gender_confirmation, a2Complement.summary.prepared_scene_uses)
  assert.equal(a2Complement.human_audio_listening_performed, false)
  assert.equal(a2Final.images.length, a2Final.summary.original_pngs)
  assert.equal(new Set(a2Final.reuses.map(r => r.path)).size, a2Final.summary.reused_images)
  assert.equal(a2Final.summary.new_scenario_audio_bindings + a2Final.summary.awaiting_gender_confirmation, a2Final.summary.prepared_scene_uses)
  assert.equal(a2Final.human_audio_listening_performed, false)
  assert.equal(review.supports.filter(r => r.level === 'A0-A1' && r.decision === 'eligible_scene_pending' && !r.preparedImage).length, 0)
  assert.equal(review.supports.filter(r => r.level === 'A1-A2' && r.decision === 'eligible_scene_pending' && !r.preparedImage).length, 0)
  assert.equal(review.supports.filter(r => r.level === 'A2-B1' && r.decision === 'eligible_scene_pending' && !r.preparedImage).length, 0)
  assert.equal(b1Final.human_audio_listening_performed, false)
  assert.equal(b1Final.images.length, b1Final.summary.original_pngs)
  assert.equal(b1Final.summary.new_scenario_audio_bindings, 0)
  assert.equal(b1Final.summary.awaiting_gender_confirmation, b1Final.summary.prepared_scene_uses)
  for (const asset of b1Final.images) {
    assert.equal(asset.gender_review.status, 'needs_voice_review')
    assert.equal(asset.scene_review.visible_interlocutors, asset.bindings[0].exercise === 'tcf-delf-actif-b1-001-02' ? 3 : 2)
    assert.equal(asset.scene_review.full_body_visible, true)
  }
  const recount = read('docs/tcf/decompte-interlocuteurs-20261115.json')
  const interlocutors = read('docs/tcf/reprise-interlocuteurs-scenes-20261114.json')
  assert.equal(recount.sources.length, recount.summary.sources_reviewed)
  assert.equal(recount.human_audio_listening_performed, false)
  assert.equal(recount.voice_gender_validated, false)
  assert.equal(interlocutors.sources.filter(s => s.status === 'full_interlocutor_recount_pending').length, 0)
  for (const row of recount.sources) {
    const source = catalog.sources.find(s => s.audio === row.audio)
    const record = interlocutors.sources.find(s => s.audio === row.audio)
    assert.equal(source.transcription, row.transcription)
    assert.equal(source.sourceSha256, row.source_sha256)
    assert.equal(sha(readFileSync(`public${row.audio}`)), row.audio_sha256)
    assert.equal(source.image, row.corrected_image ?? row.image)
    assert.equal(sha(readFileSync(`public${row.image}`)), row.image_sha256)
    if (row.corrected_image) assert.equal(sha(readFileSync(`public${row.corrected_image}`)), row.corrected_image_sha256)
    assert.equal(record.status, row.current_status ?? row.status)
    assert.equal(row.visual_review.audio_listening_performed, false)
    assert.equal(row.visual_review.voice_gender_validated, false)
    assert.equal(row.visual_review.exact_voice_count_confirmed, false)
    assert.ok(row.visual_review.note)
    if (row.visual_review.visible_main_interlocutors_minimum < row.visual_review.minimum_required_interlocutors) assert.equal(row.status, 'needs_interlocutor_rework')
  }
  const sharedBus = a2Final.reuses.find(r => r.bindings.length === 2)
  assert.ok(sharedBus)
  const busSources = sharedBus.bindings.map(binding => catalog.sources.find(source => source.exercise === binding.exercise))
  assert.equal(new Set(busSources.map(source => source.sceneKey)).size, 1)
  assert.equal(drawAssociationCompose('A1-A2', createRng(923), { audioSlots: busSources.map(source => source.audio) }), null, 'The reused bus scene cannot compete with itself')
  const suitePreparation = read('docs/gallery/preparation-scenarios-a2-suite-20261114.json')
  assert.equal(suitePreparation.generated_images, suite.images.length)
  for (const asset of [...generation.images, ...expansions.flatMap(b => b.images), ...framingCorrections.images, ...directReview.images, ...completeDialogues.images, ...finalFraming.images, ...detailCorrections.images]) {
    const bytes = readFileSync(`public${asset.path}`)
    assert.equal(sha(bytes), asset.sha256)
    assert.equal(bytes.toString('hex', 0, 8), '89504e470d0a1a0a')
    assert.deepEqual([bytes.readUInt32BE(16), bytes.readUInt32BE(20)], [1448, 1086])
    assert.equal(sha(readFileSync(`public${asset.reference}`)), asset.reference_sha256)
    assert.equal(approved.get(asset.path).source_sha256, asset.sha256)
    assert.equal(approved.get(asset.path).style_review.reference_commit, '48a753d8d6bd095e41968b39da88dbcb331fee11')
    assert.ok(asset.visual_review)
    for (const reference of asset.reference_images ?? []) assert.equal(sha(readFileSync(`public${reference.path}`)), reference.sha256)
  }
  assert.equal(framingCorrections.human_audio_listening_performed, false)
  assert.equal(framingCorrections.voice_gender_validated, false)
  assert.equal(framingCorrections.summary.new_scenario_audio_bindings, 0)
  for (const asset of framingCorrections.images) {
    assert.equal(sha(readFileSync(`public${asset.previous_image}`)), asset.previous_image_sha256)
    assert.equal(asset.scene_review.visible_interlocutors, 2)
    assert.equal(asset.scene_review.full_body_visible, true)
    for (const binding of asset.bindings) {
      const source = catalog.sources.find(s => s.audio === binding.audio)
      assert.equal(sha(binding.transcription), binding.source_sha256)
      assert.equal(sha(readFileSync(`public${binding.audio}`)), binding.audio_sha256)
      if (asset.binding_action === 'replace_existing_scene') {
        assert.equal(source.image, asset.path)
        assert.equal(source.imageSha256, asset.sha256)
        assert.equal(source.transcription, binding.transcription)
        assert.equal(source.genderAudit.voice_confirmation_pending, asset.preserves_existing_voice_reserve)
        assert.equal(tcfImageSrc(asset.previous_image), asset.path)
        assert.equal(tcfImageSrc(`${asset.previous_image}?revision=3#scene`), `${asset.path}?revision=3#scene`)
      } else {
        assert.equal(asset.binding_action, 'replace_prepared_scene')
        const support = review.supports.find(s => s.audio === binding.audio)
        if (userAccepted(source, asset.path)) {
          assert.equal(support.decision, 'eligible_bound_scene')
          assert.equal(source.genderReview.status, 'needs_voice_review', 'Editorial acceptance is distinct from voice confirmation')
        } else {
          assert.equal(source, undefined, 'An unaccepted recording keeps its scene pending')
          assert.equal(support.decision, 'eligible_scene_pending')
          assert.equal(support.preparedImage, asset.path)
          assert.equal(support.preparedImageSha256, asset.sha256)
        }
        assert.equal(support.genderReview.status, 'needs_voice_review')
        assert.ok(support.alternativeSceneImages.some(previous => previous.path === asset.previous_image))
      }
    }
  }
  for (const asset of expansions.flatMap(b => [...b.images, ...b.reuses])) {
    assert.equal(sha(readFileSync(`public${asset.path}`)), asset.sha256)
    assert.ok(asset.visual_review)
    assert.deepEqual(asset.bindings.map((b) => b.exercise), asset.exercise_ids)
    for (const binding of asset.bindings) {
      const source = catalog.sources.find((s) => s.exercise === binding.exercise)
      const reviewed = review.supports.find((s) => s.exercise === binding.exercise)
      assert.equal(reviewed.transcription, binding.transcription)
      assert.equal(reviewed.sourceSha256, binding.source_sha256)
      assert.equal(reviewed.audioSha256, binding.audio_sha256)
      assert.ok(asset.gender_review)
      for (const evidence of asset.gender_review.evidence) assert.ok(binding.transcription.includes(evidence.quote))
      if (!['documented_roles_match', 'no_visible_character'].includes(asset.gender_review.status)) {
        assert.equal(asset.gender_review.status, 'needs_voice_review')
        const accepted = userAccepted(source, asset.path)
        if (!accepted) assert.notEqual(source?.image, asset.path, 'A scene without editorial acceptance must remain unselected')
        const prepared = reviewed.preparedImage === asset.path && reviewed.preparedImageSha256 === asset.sha256
        const retained = reviewed.alternativeSceneImages?.some(candidate => candidate.path === asset.path && candidate.sha256 === asset.sha256)
        assert.ok(prepared || retained || accepted, 'Approved selections and other variants remain traceable')
        if (!source) assert.equal(reviewed.decision, 'eligible_scene_pending')
        continue
      }
      assert.ok(source)
      if (source.image !== asset.path) {
        assert.ok(reviewed.alternativeSceneImages?.some(candidate => candidate.path === asset.path && candidate.sha256 === asset.sha256), 'Approved alternatives remain traceable')
      }
      assert.equal(source.transcription, binding.transcription)
      assert.equal(source.sourceSha256, binding.source_sha256)
      assert.equal(source.audioSha256, binding.audio_sha256)
      assert.ok(['documented_roles_match', 'no_visible_character'].includes(source.genderReview.status) || userAccepted(source))
    }
  }
  assert.equal(detailCorrections.human_audio_listening_performed, false)
  assert.equal(detailCorrections.summary.active_replacements, 2)
  assert.equal(detailCorrections.summary.additional_variants, 10)
  assert.equal(detailCorrections.images.length, 12)
  assert.equal(directReview.human_audio_listening_performed, false)
  assert.equal(directReview.voice_gender_validated, false)
  assert.equal(directReview.sources.filter(row => row.action === 'activate_prepared').length, directReview.summary.activated_prepared_scenes)
  assert.equal(directReview.sources.filter(row => row.action === 'replace_existing').length, directReview.summary.replaced_existing_bindings)
  assert.equal(completeDialogues.human_audio_listening_performed, false)
  assert.equal(completeDialogues.voice_gender_validated, false)
  assert.equal(completeDialogues.sources.length, 17)
  assert.equal(completeDialogues.images.length, 17)
  assert.equal(completeDialogues.summary.replaced_existing_bindings, 17)
  assert.equal(interlocutors.sources.filter(row => row.status === 'needs_interlocutor_rework').length, 0)
  assert.equal(interlocutors.summary.confirmed_scene_bindings_to_rework, 0)
  assert.equal(finalFraming.sources.length, 21)
  assert.equal(finalFraming.images.length, 19)
  assert.equal(finalFraming.human_audio_listening_performed, false)
  assert.equal(finalFraming.voice_gender_validated, false)
  assert.equal(interlocutors.sources.filter(row => row.status === 'needs_framing_rework').length, 0)
  assert.equal(interlocutors.summary.framing_rework_bindings, 0)
  assert.equal(interlocutors.summary.contextual_rework_bindings, 0)
  assert.deepEqual(catalog.decoys, audioDecoys.candidates)
  assert.equal(catalog.decoys.length, 80)
  assert.equal(new Set(catalog.decoys.map(row => row.sceneKey)).size, 80)
  for (const [previous, image] of Object.entries(finalFraming.image_aliases)) {
    assert.equal(tcfImageSrc(previous), image)
    assert.equal(tcfImageSrc(`${previous}?revision=4#scene`), `${image}?revision=4#scene`)
    assert.equal(tcfImageSrc(previous.slice('/lib/images/'.length)), image)
  }
  assert.equal(review.summary.scenario_pending, 0)
  for (const accepted of [...directReview.sources, ...completeDialogues.sources, ...finalFraming.sources, ...detailCorrections.sources]) {
    const source = catalog.sources.find(row => row.audio === accepted.audio)
    assert.ok(userAccepted(source, accepted.image))
    assert.equal(sha(readFileSync(`public${accepted.image}`)), accepted.image_sha256)
    assert.ok(accepted.scene_review.visible_interlocutors >= 2)
    assert.equal(accepted.scene_review.full_body_visible, true)
    assert.equal(sha(readFileSync(`public${accepted.previous_image}`)), accepted.previous_image_sha256)
    for (const level of ['A0-A1', 'A1-A2', 'A2-B1']) {
      const pinned = drawAssociationCompose(level, createRng(923), { audioSlots: [accepted.audio] })
      assert.ok(pinned, `Accepted source remains selectable: ${accepted.exercise}`)
      assert.equal(pinned.support.audios[0], accepted.audio)
      assert.equal(pinned.situations.find(scene => scene.dialogue === 1).image, source.image)
    }
  }
  // Keep this guard once the last pending scene has been illustrated too.
  const unillustrated = review.supports.find((r) => r.decision !== 'eligible_bound_scene')
  const pendingEntry = tcfAudioEntries([bank.find((e) => e.id === unillustrated.exercise)])[0]
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
