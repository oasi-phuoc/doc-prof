import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createServer } from 'vite'

const vite = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
try {
  const { validateTcfExercise, isTcfExerciseShape } = await vite.ssrLoadModule('/src/tcf/validate.ts')
  const { tcfAudioEntries } = await vite.ssrLoadModule('/src/tcf/audio-bank.ts')
  const { tcfBankAllLevels } = await vite.ssrLoadModule('/src/tcf/loader.ts')
  const { tcfTagForAudioDuration } = await vite.ssrLoadModule('/src/tcf/audio-tags.ts')
  const all = []
  for (const level of ['a0-a1', 'a1-a2', 'a2-b1']) {
    for (const skill of ['ce', 'co']) {
      const rows = JSON.parse(readFileSync(`src/tcf/content/${level}/${skill}.json`, 'utf8'))
      for (const ex of rows) {
        assert.ok(isTcfExerciseShape(ex), ex.id)
        assert.deepEqual(validateTcfExercise(ex).errors, [], ex.id)
      }
      all.push(...rows)
    }
  }
  assert.equal(tcfBankAllLevels('CE').length + tcfBankAllLevels('CO').length, all.length,
    'No corrected exercise may disappear when the application loads the bank')
  const durations = JSON.parse(readFileSync('src/tcf/content/audio-durations.json', 'utf8'))
  const audioEntries = tcfAudioEntries(all.filter(ex => ex.competence === 'CO'))
  const audioPaths = new Set(all.filter(ex => ex.competence === 'CO').flatMap(ex =>
    ex.support.audios?.length ? ex.support.audios : [ex.support.audio]))
  assert.equal(audioEntries.length, audioPaths.size, 'Every audio remains indexed once')
  let pools = 0
  for (const entry of audioEntries) {
    if (!entry.questionPool?.length) continue
    pools++
    const expected = tcfTagForAudioDuration(durations[entry.audio])
    assert.ok(entry.tags.includes(expected), entry.audio)
    assert.equal(entry.tags.filter(t => ['court', 'moyen', 'long'].includes(t)).length, 1, entry.audio)
  }
  // Adding useful questions must never turn the same short recording into a long one.
  const short = audioEntries.find(e => e.tags.includes('court') && e.questionPool?.length)
  assert.ok(short)
  const ex = structuredClone(short.exercise)
  ex.type_exercice = 'complet'
  ex.support = { audio: short.audio }
  ex.questions = Array.from({ length: 10 }, () => structuredClone(short.questionPool[0]))
  assert.ok(tcfAudioEntries([ex])[0].tags.includes('court'))
  assert.equal(tcfTagForAudioDuration(15), 'court')
  assert.equal(tcfTagForAudioDuration(15.01), 'moyen')
  assert.equal(tcfTagForAudioDuration(45), 'moyen')
  assert.equal(tcfTagForAudioDuration(45.01), 'long')
  console.log(`TCF: ${all.length} exercises loaded, ${audioEntries.length} audios indexed, ${pools} pools classified by duration`)
} finally {
  await vite.close()
}
