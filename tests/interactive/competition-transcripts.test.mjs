import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
const previousStorage = globalThis.sessionStorage, stored = new Map()
globalThis.sessionStorage = { getItem: key => stored.get(key) ?? null, setItem: (key, value) => stored.set(key, String(value)) }
try {
  const { competitionQuiz, parseCompetitionQuiz, parseCompetitionSettings, createCompetition, competitionStep: step, competitionView: view } = await server.ssrLoadModule('/src/interactive/competition/core.ts')
  const { newLocalCompetition, readLocalCompetition, writeLocalCompetition } = await server.ssrLoadModule('/src/interactive/competition/local.ts')
  const { PALETTE, defaultShapes } = await server.ssrLoadModule('/src/interactive/domain/palette.ts')
  const origin = 'https://class.example', transcript = 'Texte privé de l’écoute : le rendez-vous est à midi.', otherText = 'Une autre écoute sans lien avec la première.'
  const colors = PALETTE.map(color => color.color), settings = { enabled: false, seconds: 30, feedbackSeconds: 10, speedPoints: false, showTranscripts: true }
  const q = (id, audio = `${origin}/one.mp3`) => ({ id, source: { page: 0, block: 0, item: 0, part: 0, exerciseType: 'tcf-co' }, title: 'Écoute', instruction: 'Écoutez.', prompt: `Question ${id} ?`, audio, images: [], choices: [{ id: 'yes', text: 'midi' }, { id: 'no', text: 'demain' }], mode: 'choice', compatibility: 'auto' })
  const game = { id: 'source-listening', title: 'Écoutes', questions: [q('first'), q('other', `${origin}/two.mp3`), q('last')], corrections: { first: { choiceId: 'yes', text: 'midi', transcript }, other: { choiceId: 'no', text: 'demain', transcript: otherText }, last: { choiceId: 'no', text: 'demain', transcript } }, issues: [] }
  const quiz = parseCompetitionQuiz(competitionQuiz(game, origin, true), [origin])
  let now = 100_000
  const send = (room, action) => step(room, action, ++now)
  const begin = (mode = 'online', input = quiz, options = settings) => {
    let room = createCompetition(input, options, mode, '123456', now, colors, defaultShapes)
    room = send(room, { type: 'join', avatarId: 'panda' }); room = send(room, { type: 'join', avatarId: 'fox' })
    return send(room, { type: 'start' })
  }
  const answer = (room, playerId = 'p1') => send(room, { type: 'answer', playerId, questionId: room.quiz.items[room.index].question.id, choiceId: room.quiz.items[room.index].correctChoiceId })
  const hidden = room => { for (const player of [undefined, 'p1', 'p2']) assert.ok(!JSON.stringify(view(room, now, player)).includes(transcript)) }

  await test('source transcripts require explicit export and stay beside the private answer key, never inside projected questions', () => {
    const before = structuredClone(game)
    assert.ok(!JSON.stringify(competitionQuiz(game, origin)).includes(transcript))
    const exported = competitionQuiz(game, origin, true)
    assert.equal(exported.items[0].transcript, transcript)
    assert.equal(exported.items[2].transcript, transcript)
    assert.ok(exported.items.every(item => !('transcript' in item.question)))
    assert.deepEqual(game, before)
  })

  await test('the server bounds private transcript text, requires an audio and strips forged public question fields', () => {
    assert.equal(quiz.items[0].transcript, transcript)
    for (const invalid of ['', ' ', 42, null, 'x'.repeat(30_001)]) {
      const copy = structuredClone(quiz); copy.items[0].transcript = invalid
      assert.throws(() => parseCompetitionQuiz(copy, [origin]), /Transcription/)
    }
    const noAudio = structuredClone(quiz); delete noAudio.items[0].question.audio
    assert.throws(() => parseCompetitionQuiz(noAudio), /Transcription/)
    const forged = structuredClone(quiz); forged.items[0].question.transcript = 'Public injection'
    assert.equal(parseCompetitionQuiz(forged).items[0].question.transcript, undefined)
    assert.throws(() => parseCompetitionSettings({ ...settings, showTranscripts: 'yes' }), /transcriptions/)
  })

  await test('online participants and host cannot receive a transcript before everyone finishes the last related question, even with an unrelated question between', () => {
    let room = begin(); hidden(room)
    room = answer(room); hidden(room)
    room = answer(room, 'p2'); assert.equal(room.phase, 'correction'); hidden(room)
    room = send(room, { type: 'next' }); room = answer(answer(room), 'p2')
    assert.equal(view(room, now, 'p1').transcript, otherText)
    hidden(room)
    room = send(room, { type: 'next' }); hidden(room)
    room = answer(room); hidden(room)
    room = answer(room, 'p2')
    for (const player of [undefined, 'p1', 'p2']) {
      const publicView = view(room, now, player)
      assert.equal(publicView.transcript, transcript)
      assert.equal(publicView.question.transcript, undefined)
      assert.equal(publicView.quiz, undefined)
    }
    room = send(room, { type: 'next' }); hidden(room)
  })

  await test('local handoffs and earlier turns never reveal the text or the previous answer to the next mascot', () => {
    const one = { ...quiz, items: [quiz.items[0]] }
    let room = begin('local', one); hidden(room)
    room = send(room, { type: 'begin-turn' }); hidden(room)
    room = answer(room); hidden(room)
    assert.equal(room.phase, 'handoff'); assert.equal(view(room, now, 'p2').question, undefined)
    room = send(room, { type: 'begin-turn' }); hidden(room)
    room = answer(room, 'p2'); assert.equal(view(room, now, 'p2').transcript, transcript)
  })

  await test('disabled and legacy settings keep all texts private, while conflicting source versions cannot choose an arbitrary transcript', () => {
    for (const options of [{ ...settings, showTranscripts: false }, { enabled: false, seconds: 30, feedbackSeconds: 10, speedPoints: false }]) {
      let room = begin('online', { ...quiz, items: [quiz.items[0]] }, options)
      room = answer(answer(room), 'p2'); hidden(room)
    }
    const conflict = structuredClone(quiz); conflict.items[2].transcript = 'Une version contradictoire.'
    let room = begin('online', conflict)
    for (let i = 0; i < 3; i++) { room = answer(answer(room), 'p2'); if (i < 2) room = send(room, { type: 'next' }) }
    assert.equal(view(room, now).transcript, undefined)
  })

  await test('two composed recordings with a common first clip remain independent review documents', () => {
    const copy = structuredClone(quiz); copy.items = copy.items.slice(0, 2)
    for (let i = 0; i < 2; i++) { copy.items[i].question.audio = `${origin}/prefix.mp3`; copy.items[i].question.audioParts = [`${origin}/prefix.mp3`, `${origin}/suffix-${i}.mp3`] }
    let room = begin('online', copy); room = answer(answer(room), 'p2')
    assert.equal(view(room, now).transcript, transcript)
    room = send(room, { type: 'next' }); assert.equal(view(room, now).transcript, undefined)
    room = answer(answer(room), 'p2'); assert.equal(view(room, now).transcript, otherText)
  })

  await test('timeouts release only corrected text; pausing a review preserves remaining correction time and never alters points', () => {
    let room = begin('online', { ...quiz, items: [quiz.items[0]] }, { ...settings, enabled: true, seconds: 5 })
    now = room.deadline; room = step(room, { type: 'tick' }, now)
    assert.equal(view(room, now).transcript, transcript)
    assert.deepEqual(room.players.map(player => player.score), [0, 0])
    now += 1000; room = step(room, { type: 'pause' }, now)
    const remaining = room.remainingMs, snapshot = structuredClone(room.players)
    now += 15_000; assert.equal(step(room, { type: 'tick' }, now), room)
    assert.equal(view(room, now).transcript, transcript)
    room = step(room, { type: 'resume' }, now)
    assert.equal(room.deadline, now + remaining); assert.deepEqual(room.players, snapshot)
    now = room.deadline; room = step(room, { type: 'tick' }, now)
    assert.equal(room.phase, 'finished'); hidden(room)
  })

  await test('local replay rebuilds transcript eligibility without adding source texts or reading state to the action journal; old settings remain private', () => {
    const one = { ...quiz, items: [quiz.items[0]] }, at = now
    const fresh = newLocalCompetition(one, settings, colors, defaultShapes, at)
    const actions = [{ type: 'join', avatarId: 'panda' }, { type: 'start' }, { type: 'begin-turn' }, { type: 'answer', playerId: 'p1', questionId: 'q1', choiceId: 'c0' }, { type: 'pause' }]
    const journal = { ...fresh.journal, events: actions.map((action, index) => ({ at: at + index, action })) }
    assert.equal(writeLocalCompetition(journal), true)
    const resumed = readLocalCompetition(one, settings, colors, defaultShapes, at + 20)
    assert.equal(resumed.warning, ''); assert.equal(view(resumed.room, at + 20).transcript, transcript)
    assert.ok(!JSON.stringify([...stored.values()]).includes(transcript))
    assert.ok(!JSON.stringify(journal).includes('readingAt'))
    const legacy = structuredClone(journal); delete legacy.settings.showTranscripts; writeLocalCompetition(legacy)
    const older = readLocalCompetition(one, settings, colors, defaultShapes, at + 20)
    assert.equal(older.warning, ''); assert.equal(view(older.room, at + 20).transcript, undefined)
  })
} finally { globalThis.sessionStorage = previousStorage; await server.close() }
