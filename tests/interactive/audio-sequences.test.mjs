import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createServer } from 'vite'

const server = await createServer({ cacheDir: '/tmp/clairfle-audio-sequences-unit', server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  const { convertRecipe } = await server.ssrLoadModule('/src/interactive/domain/convert.ts')
  const { prepareGame, roundsFor } = await server.ssrLoadModule('/src/interactive/domain/plan.ts')
  const { demoRecipe } = await server.ssrLoadModule('/src/interactive/demo.ts')
  const { createRng } = await server.ssrLoadModule('/src/math/rng.ts')
  const { generateCscExercise } = await server.ssrLoadModule('/src/tcm-csc/items.ts')
  const { tryGenerateTcmCfrItems } = await server.ssrLoadModule('/src/tcm-cfr/items.ts')
  const { numberAudioParts, mulAudioParts } = await server.ssrLoadModule('/src/tcm-cfr/audio-nombres.ts')
  const { composeAudioParts, MAX_SEQUENCE_BYTES } = await server.ssrLoadModule('/src/interactive/media/compose-audio.ts')
  const { collectMedia, unavailableQuestionIds } = await server.ssrLoadModule('/src/interactive/media/assets.ts')
  const { competitionQuiz, parseCompetitionQuiz } = await server.ssrLoadModule('/src/interactive/competition/core.ts')
  const { planIdentity } = await server.ssrLoadModule('/src/interactive/domain/persistence.ts')
  const base = demoRecipe(), policy = { baseUrl: 'https://class.test/interactif/demo' }
  function game(items, seed = 42) { return convertRecipe({ ...base, seed, pages: [{ ...base.pages[0], libreItems: items, count: items.length, extraBlocks: undefined }] }) }
  function dictation(value) { const parts = numberAudioParts(value); return { layout: 'audio-dictation', answer: String(value), audioSrc: parts[0], audioParts: parts } }
  function buffer(channels, rate = 8) {
    const arrays = channels.map((channel) => new Float32Array(channel))
    return { sampleRate: rate, numberOfChannels: arrays.length, length: arrays[0].length, duration: arrays[0].length / rate, getChannelData: (index) => arrays[index] }
  }
  function depsFor(buffers) {
    const calls = [], decoded = [], closed = [], created = []
    const deps = { fetch: async (url, options) => { calls.push({ url, options }); return new Response(Uint8Array.of(url.endsWith('b.mp3') ? 2 : 1), { headers: { 'content-type': 'audio/mpeg' } }) }, createContext: () => { created.push(true); return { sampleRate: 8, decodeAudioData: async (data) => { decoded.push(data); return buffers[new Uint8Array(data)[0] - 1] }, createBuffer: (channels, length, rate) => buffer(Array.from({ length: channels }, () => Array(length).fill(0)), rate), close: async () => { closed.push(true) } } } }
    return { deps, calls, decoded, closed, created }
  }

  await test('100 real CSC and CFR draws preserve every spoken number and calculation, source clip and answer', () => {
    for (let seed = 1; seed <= 100; seed++) for (const domain of ['csc', 'cfr']) for (const number of [1, 2]) {
      const items = domain === 'csc' ? generateCscExercise(`tcm-csc-ex0${number}`, 5, seed) : tryGenerateTcmCfrItems(`tcm-cfr-ex0${number}`, 5, createRng(seed), seed)
      const before = structuredClone(items), converted = game(items, seed)
      assert.equal(converted.questions.length, 5); assert.deepEqual(converted.issues, [])
      for (const [index, question] of converted.questions.entries()) {
        assert.deepEqual(question.audioParts ?? [question.audio], items[index].audioParts)
        assert.equal(question.audio, items[index].audioParts[0])
        assert.equal(question.audioGrouping, 'individual')
        assert.equal(question.choices.find((choice) => choice.id === converted.corrections[question.id].choiceId).text, Number(items[index].answer).toLocaleString('fr-CH'))
        assert.ok(!/\d/.test(question.prompt), 'The spoken operands and result are absent from the prompt.')
        assert.equal('answer' in question, false)
      }
      for (const mode of ['class', 'solo']) { const prepared = prepareGame(converted, undefined, mode); assert.equal(prepared.questions.length, 5); assert.equal(roundsFor(prepared).length, 5) }
      assert.deepEqual(items, before)
    }
  })
  await test('shared first clips cannot merge, drop or mismatch distinct numbers, or repeated dictation questions', async () => {
    const converted = game([201, 202, 203, 204, 205, 201].map(dictation))
    assert.equal(new Set(converted.questions.map((question) => question.audio)).size, 1)
    const prepared = prepareGame(converted)
    assert.equal(prepared.questions.length, 6); assert.equal(prepared.rounds.length, 6)
    assert.deepEqual(prepared.rounds.map((round) => round.audioParts), converted.questions.map((question) => question.audioParts))
    const changed = structuredClone(prepared); changed.questions[0].audioParts.reverse()
    assert.notEqual(await planIdentity(prepared), await planIdentity(changed))
  })
  await test('the complete canonical number vocabulary includes zero, hundreds, and one thousand', () => {
    const items = Array.from({ length: 1000 }, (_, i) => dictation(i + 1))
    items.push({ layout: 'audio-dictation', answer: '0', audioParts: ['/lib/audio/vocabulaire/objets/zéro.mp3'] })
    assert.equal(game(items).questions.length, 1001)
  })
  await test('missing, reordered or stale clips, unsupported operands and stale answers never invent an audio verdict', () => {
    const item = dictation(201), multiplication = { layout: 'audio-dictation', left: '3', right: '4', audioParts: mulAudioParts(3, 4), answer: '12' }
    for (const broken of [
      { ...item, answer: '202' }, { ...item, audioParts: item.audioParts.slice(0, 1) }, { ...item, audioParts: [...item.audioParts].reverse(), audioSrc: undefined },
      { ...item, audioSrc: '/unrelated.mp3' }, { ...item, answer: '20,1' }, { ...item, audioParts: [] },
      { ...multiplication, answer: '13' }, { ...multiplication, left: '0' }, { ...multiplication, audioParts: mulAudioParts(4, 3) },
      { layout: 'audio-dictation', audioParts: ['/foreign.mp3'], answer: '12' },
    ]) { const rejected = game([broken]); assert.equal(rejected.questions.length, 0); assert.ok(rejected.issues.length) }
  })
  await test('preflight checks every clip and excludes only questions using an unavailable clip', () => {
    const converted = game([201, 202].map(dictation)), assets = collectMedia(converted.questions, policy)
    assert.equal(assets.length, 3)
    const shared = assets.find((asset) => asset.url.endsWith('/2.mp3'))
    assert.equal(shared.questionIds.length, 2)
    const suffix = assets.find((asset) => asset.url.endsWith('/1.mp3'))
    assert.deepEqual([...unavailableQuestionIds([{ asset: suffix, status: 'missing' }])], [converted.questions[0].id])
  })
  await test('competition payloads preserve ordered clips and validate count, origin and first-track consistency', () => {
    const quiz = competitionQuiz(game([dictation(201)]), 'https://class.test'), before = structuredClone(quiz)
    const parsed = parseCompetitionQuiz(quiz, ['https://class.test'])
    assert.deepEqual(parsed.items[0].question.audioParts, quiz.items[0].question.audioParts)
    for (const parts of [[], Array(13).fill(quiz.items[0].question.audio), ['https://evil.test/a.mp3'], [...quiz.items[0].question.audioParts].reverse()]) {
      const broken = structuredClone(quiz); broken.items[0].question.audioParts = parts
      assert.throws(() => parseCompetitionQuiz(broken, ['https://class.test']))
    }
    const missing = structuredClone(quiz); delete missing.items[0].question.audio
    assert.throws(() => parseCompetitionQuiz(missing, ['https://class.test']))
    assert.deepEqual(quiz, before)
  })
  await test('WAV composition preserves sample order, repeated clips and stereo channels, fetching each source once', async () => {
    const fixture = depsFor([buffer([[.1, .2], [.3, .4]]), buffer([[.5, .6]])])
    const blob = await composeAudioParts(['/a.mp3', '/b.mp3', '/a.mp3'], policy, new AbortController().signal, fixture.deps)
    const wav = Buffer.from(await blob.arrayBuffer())
    assert.equal(wav.toString('ascii', 0, 4), 'RIFF'); assert.equal(wav.toString('ascii', 8, 12), 'WAVE')
    assert.equal(wav.readUInt16LE(22), 2); assert.equal(wav.readUInt32LE(24), 8)
    const samples = [.1, .3, .2, .4, .5, .5, .6, .6, .1, .3, .2, .4]
    samples.forEach((value, index) => assert.ok(Math.abs(wav.readInt16LE(44 + index * 2) - Math.trunc(value * 32767)) <= 1))
    assert.equal(fixture.calls.length, 2); assert.equal(fixture.closed.length, 1)
    assert.ok(fixture.calls.every(({ options }) => options.redirect === 'error'))
  })
  await test('invalid and foreign clip addresses are rejected before creating a decoder or issuing any request', async () => {
    const fixture = depsFor([buffer([[.1]])])
    for (const parts of [[], Array(13).fill('/a.mp3'), ['/a.mp3', 'https://evil.test/a.mp3'], ['javascript:alert(1)'], ['blob:https://evil.test/fake']]) await assert.rejects(composeAudioParts(parts, policy, new AbortController().signal, fixture.deps))
    assert.equal(fixture.calls.length, 0); assert.equal(fixture.created.length, 0)
  })
  await test('a missing, empty, undecodable or non-audio suffix rejects the whole sequence and releases its decoder', async () => {
    for (const response of [new Response('', { status: 404 }), new Response('HTML', { headers: { 'content-type': 'text/html' } }), new Response(new Uint8Array(), { headers: { 'content-type': 'audio/mpeg' } })]) {
      const fixture = depsFor([buffer([[.1]])]), original = fixture.deps.fetch
      fixture.deps.fetch = (url, options) => url.endsWith('b.mp3') ? Promise.resolve(response) : original(url, options)
      await assert.rejects(composeAudioParts(['/a.mp3', '/b.mp3'], policy, new AbortController().signal, fixture.deps))
      assert.equal(fixture.closed.length, 1)
    }
    const fixture = depsFor([buffer([[.1]])]), context = fixture.deps.createContext()
    context.decodeAudioData = async () => { throw new Error('Decoder error') }; fixture.deps.createContext = () => context
    await assert.rejects(composeAudioParts(['/a.mp3'], policy, new AbortController().signal, fixture.deps), /Decoder/)
    assert.equal(fixture.closed.length, 1)
  })
  await test('declared and streamed byte limits and decoded duration limits prevent oversized composition', async () => {
    const fixture = depsFor([buffer([[.1]])])
    fixture.deps.fetch = async () => new Response(Uint8Array.of(1), { headers: { 'content-type': 'audio/mpeg', 'content-length': String(MAX_SEQUENCE_BYTES + 1) } })
    await assert.rejects(composeAudioParts(['/a.mp3'], policy, new AbortController().signal, fixture.deps), /volumineux/)
    let cancelled = false
    fixture.deps.fetch = async () => new Response(new ReadableStream({ start(controller) { const chunk = new Uint8Array(MAX_SEQUENCE_BYTES / 2 + 1); controller.enqueue(chunk); controller.enqueue(chunk) }, cancel() { cancelled = true } }), { headers: { 'content-type': 'audio/mpeg', 'content-length': '1' } })
    await assert.rejects(composeAudioParts(['/a.mp3'], policy, new AbortController().signal, fixture.deps), /volumineux/)
    assert.equal(cancelled, true)
    const long = depsFor([buffer([Array(61 * 8).fill(.1)])])
    await assert.rejects(composeAudioParts(['/a.mp3', '/a.mp3'], policy, new AbortController().signal, long.deps), /longue/)
    assert.equal(long.closed.length, 1)
  })
  await test('cancellation interrupts a pending decoder, prevents a late result and closes the audio context', async () => {
    const fixture = depsFor([buffer([[.1]])]), context = fixture.deps.createContext(), controller = new AbortController()
    let finish
    context.decodeAudioData = () => new Promise((resolve) => { finish = resolve; controller.abort() }); fixture.deps.createContext = () => context
    await assert.rejects(composeAudioParts(['/a.mp3'], policy, controller.signal, fixture.deps), { name: 'AbortError' })
    assert.equal(fixture.closed.length, 1)
    finish(buffer([[.1]]))
  })
} finally { await server.close() }
