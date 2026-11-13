/** Check production bytes, application indexing and real TCF draws for the new collections. */
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { createServer } from 'vite'
const directory = 'docs/tcf/delf-actif-20261113'
const installation = JSON.parse(readFileSync(`${directory}/installation.json`, 'utf8'))
const expected = new Map(installation.units.map(row => [row.exercise_id, row]))
assert.equal(expected.size, 346)
assert.equal(installation.questions, 1663)
const server = await createServer({ cacheDir: '/tmp/clairfle-delf-actif-vite', server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
try {
  const { tcfBankAllLevels } = await server.ssrLoadModule('/src/tcf/loader.ts')
  const { tcfAudioEntries } = await server.ssrLoadModule('/src/tcf/audio-bank.ts')
  const { validateTcfExercise } = await server.ssrLoadModule('/src/tcf/validate.ts')
  const { drawSixCourtsCompose, drawTroisMoyensCompose, drawUnLongCompose } = await server.ssrLoadModule('/src/tcf/draw-series.ts')
  const { createRng } = await server.ssrLoadModule('/src/math/rng.ts')
  const bank = tcfBankAllLevels('CO')
  const added = bank.filter(ex => expected.has(ex.id))
  assert.equal(added.length, expected.size)
  let questions = 0
  for (const exercise of added) {
    const record = expected.get(exercise.id)
    assert.deepEqual(validateTcfExercise(exercise).errors, [], exercise.id)
    assert.equal(exercise.support.audio, record.audio)
    const bytes = readFileSync(`public${record.audio}`)
    assert.equal(createHash('sha256').update(bytes).digest('hex'), record.audio_sha256, exercise.id)
    assert.equal(exercise.questions.length, record.questions)
    assert.equal(new Set(exercise.questions.map(q => q.enonce)).size, record.questions)
    assert.ok(exercise.support.transcription.trim())
    for (const q of exercise.questions) {
      assert.equal(q.choix.length, 3)
      assert.equal(q.choix.filter(c => c.correct).length, 1)
      assert.equal(new Set(q.choix.map(c => c.texte.toLowerCase())).size, 3)
      assert.ok(q.formes.lignes.reponse_modele)
      assert.equal(q.formes.qcm_image, undefined)
    }
    questions += record.questions
  }
  assert.equal(questions, installation.questions)
  const entries = tcfAudioEntries(bank).filter(entry => expected.has(entry.exercise.id))
  assert.equal(entries.length, expected.size)
  for (const entry of entries) {
    const record = expected.get(entry.exercise.id)
    assert.equal(entry.questionPool.length, record.questions, `${entry.audio}: no question lost in indexing`)
    const minimum = record.duration_seconds <= 15 ? 2 : record.duration_seconds <= 45 ? 4 : 8
    assert.ok(record.questions >= minimum)
  }
  const draws = []
  for (const level of ['A0-A1', 'A1-A2', 'A2-B1']) {
    const here = entries.filter(e => e.exercise.niveau === level)
    const short = here.filter(e => e.tags.includes('court')).slice(0, 6).map(e => e.audio)
    const medium = here.filter(e => e.tags.includes('moyen')).slice(0, 3).map(e => e.audio)
    assert.equal(short.length, 6); assert.equal(medium.length, 3)
    const six = drawSixCourtsCompose(level, createRng(531), { audioSlots: short })
    assert.deepEqual(six.support.audios, short)
    assert.equal(six.questions.length, 6)
    const three = drawTroisMoyensCompose(level, createRng(531), { audioSlots: medium })
    assert.deepEqual(three.support.audios, medium)
    assert.equal(three.questions.length, 6)
    const long = here.find(e => e.tags.includes('long'))
    assert.ok(long, level)
    const complete = drawUnLongCompose(level, createRng(531), { audioSlots: [long.audio], questionCount: 10 })
    assert.equal(complete.support.audio, long.audio)
    assert.equal(complete.support.transcription, long.exercise.support.transcription)
    assert.equal(complete.questions.length, Math.min(10, long.questionPool.length))
    draws.push({ level, short: short.length, medium: medium.length, complete: complete.questions.length })
  }
  console.log(JSON.stringify({ supports: added.length, questions, sha256: 'all production files match reviewed MP3 bytes', draws }))
} finally { await server.close() }
