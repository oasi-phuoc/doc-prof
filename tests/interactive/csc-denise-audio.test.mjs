import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFileSync } from 'node:fs'
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  const { planCscDeniseAudio, audibleCscSamples, CSC_TCF_BEEP } = await server.ssrLoadModule('/src/tcm-csc/denise-audio.ts')
  const { cscDeniseRecordingsReady } = await server.ssrLoadModule('/src/tcm-csc/denise-recordings.ts')
  const { generateCscExercise } = await server.ssrLoadModule('/src/tcm-csc/items.ts')
  const { cscAudioPrompts } = await server.ssrLoadModule('/src/tcm-csc/audio.ts')
  const spec = JSON.parse(readFileSync('src/tcm-csc/denise-recordings.json', 'utf8'))
  await test('nine exact Denise requests; pronunciation inputs never contain examples or phonetic notation', () => {
    assert.equal(spec.files.length, 9)
    assert.equal(new Set(spec.files.map(f => f.filename)).size, 9)
    assert.deepEqual(spec.files.filter(f => f.filename.startsWith('lettre')).map(f => f.synthesisText), ['a', 'bé', 'cé', 'dé', 'e'])
    assert.equal(spec.files.find(f => f.filename === 'plus.mp3').synthesisText, 'plusse')
    assert.equal(spec.files.find(f => f.filename === 'moins.mp3').synthesisText, 'moins')
    assert.equal(spec.voice, 'fr-FR-DeniseNeural')
    assert.equal(spec.rate, '-25%')
    for (const row of spec.files) assert.doesNotMatch(row.synthesisText, /\.mp3|plys|mwɛ̃|deux plus cinq|avec le|moins :/)
  })
  await test('all nine validated mono 24k recordings are required before activating the new montage', () => {
    const ready = { ...spec, status: 'generated', files: spec.files.map(f => ({ ...f, bytes: 5000, duration: 1, sha256: 'a'.repeat(64), sampleRate: 24000, channels: 1 })) }
    assert(cscDeniseRecordingsReady(ready))
    assert(!cscDeniseRecordingsReady({ ...ready, status: 'not_generated' }))
    assert(!cscDeniseRecordingsReady({ ...ready, voice: 'another-voice' }))
    assert(!cscDeniseRecordingsReady({ ...ready, rate: '-10%' }))
    assert(!cscDeniseRecordingsReady({ ...ready, files: ready.files.slice(0, 8) }))
    assert(!cscDeniseRecordingsReady({ ...ready, files: ready.files.map((f, i) => i === 4 ? { ...f, channels: 2 } : f) }))
  })
  await test('100 seeds: unchanged variable prompts A–E are repeated exactly twice without any result recording', () => {
    for (let seed = 0; seed < 100; seed++) for (const number of [1, 2, 3]) {
      const type = `tcm-csc-ex0${number}`, items = generateCscExercise(type, number === 3 ? 1 : 5, seed + 1)
      const questions = cscAudioPrompts(type, items), sequence = planCscDeniseAudio(number, questions)
      const clips = sequence.filter(s => s.kind === 'clip').map(s => s.src)
      assert.equal(clips.filter(src => src === CSC_TCF_BEEP).length, 2)
      assert.equal(clips.filter(src => src.includes('/consigne-')).length, 1)
      assert.deepEqual(clips.filter(src => src.includes('/lettre-')).map(src => /lettre-(.).mp3/.exec(src)[1]), [...'abcdeabcde'])
      assert.equal(sequence.filter(s => s.kind === 'silence' && s.seconds === 5).length, 1)
      assert.equal(sequence.filter(s => s.kind === 'silence' && s.seconds === 7).length, 9)
      const heard = clips.filter(src => src !== CSC_TCF_BEEP && !src.includes('/consigne-') && !src.includes('/lettre-'))
      const expected = questions.flat().map(src => src.replace('/lib/audio/nombre/plus.mp3', '/lib/audio/tcm-csc/denise/plus.mp3').replace('/lib/audio/nombre/moins.mp3', '/lib/audio/tcm-csc/denise/moins.mp3'))
      assert.deepEqual(heard, [...expected, ...expected])
      assert.equal(heard.length, number === 2 ? 30 : 10)
      assert.equal(sequence.at(-1).kind, 'clip')
    }
    assert.throws(() => planCscDeniseAudio(1, [['one']] ), /cinq questions/)
  })
  await test('clip silence is trimmed before explicit beat durations are inserted; an empty take fails', () => {
    const padded = new Float32Array([0, 0.00001, 0, 0.15, -0.1, 0.05, 0, 0.00001, 0])
    assert.deepEqual([...audibleCscSamples(padded)], [...padded.slice(3, 6)])
    assert.throws(() => audibleCscSamples(new Float32Array(100)), /aucun son/)
  })
} finally { await server.close() }
