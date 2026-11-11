import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createServer } from 'vite'
const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  const { createCompetition, competitionStep: step, competitionView: view, parseCompetitionQuiz, pointsFor, ROOM_LIFETIME } = await server.ssrLoadModule('/src/interactive/competition/core.ts')
  const quiz = { id: 'competition-fixture', title: 'Calculons', items: [1, 2].map((n) => ({ question: { id: `q${n}`, prompt: `${n} + 2 = ?`, images: [], choices: [{ id: 'c0', text: String(n + 2) }, { id: 'c1', text: '99' }] }, correctChoiceId: 'c0' })) }
  const settings = { enabled: true, seconds: 10, feedbackSeconds: 5, speedPoints: true }
  const startAt = 100_000
  function ready(mode = 'online', overrides = {}) {
    let room = createCompetition(quiz, { ...settings, ...overrides }, mode, '123456', startAt)
    room = step(room, { type: 'join', avatarId: 'panda' }, startAt)
    room = step(room, { type: 'join', avatarId: 'panda' }, startAt)
    return step(room, { type: 'start' }, startAt)
  }
  await test('competition exposes only the current question, never future answers or another player’s vote', () => {
    let room = ready()
    room = step(room, { type: 'answer', playerId: 'p1', questionId: 'q1', choiceId: 'c0' }, startAt + 2000)
    const player = view(room, startAt + 2000, 'p2'), text = JSON.stringify(player)
    assert.equal(player.answered, 1); assert.equal(player.players[0].score, 0)
    assert.equal(player.correctChoiceId, undefined); assert.equal(player.self.answered, false)
    for (const key of ['correctChoiceId', 'answers', 'elapsedMs', 'quiz']) assert.ok(!Object.hasOwn(player, key))
    assert.ok(!text.includes('q2')); assert.equal(player.players.some((entry) => Object.hasOwn(entry, 'selected') || Object.hasOwn(entry, 'lastCorrect')), false)
    assert.equal(room.players[0].avatarId, room.players[1].avatarId); assert.notEqual(room.players[0].seat, room.players[1].seat)
  })
  await test('server receipt time determines speed points; repeated answers are idempotent and changes are refused', () => {
    let room = ready()
    const action = { type: 'answer', playerId: 'p1', questionId: 'q1', choiceId: 'c0' }
    room = step(room, action, startAt + 2000)
    assert.equal(step(room, action, startAt + 3000), room)
    assert.throws(() => step(room, { ...action, choiceId: 'c1' }, startAt + 3000), /déjà/)
    room = step(room, { type: 'answer', playerId: 'p2', questionId: 'q1', choiceId: 'c1' }, startAt + 3000)
    assert.equal(room.phase, 'correction'); assert.deepEqual(room.players.map((player) => player.score), [900, 0])
    assert.equal(view(room, startAt + 3000, 'p1').correctChoiceId, 'c0')
    assert.equal(view(room, startAt + 3000, 'p1').self.points, 900)
    assert.equal(step(room, action, startAt + 4000).players[0].score, 900)
  })
  await test('late answers cannot score and timer expiry reveals before automatic progression', () => {
    const original = ready()
    assert.throws(() => step(original, { type: 'answer', playerId: 'p1', questionId: 'q1', choiceId: 'c0' }, startAt + 10_000), /terminé/)
    let room = step(original, { type: 'tick' }, startAt + 10_000)
    assert.equal(room.phase, 'correction'); assert.ok(room.players.every((player) => player.score === 0 && player.lastCorrect === false))
    room = step(room, { type: 'tick' }, startAt + 15_000)
    assert.equal(room.phase, 'question'); assert.equal(room.index, 1)
    assert.equal(view(room, startAt + 15_000, 'p1').correctChoiceId, undefined)
    room = step(room, { type: 'tick' }, startAt + 25_000)
    room = step(room, { type: 'tick' }, startAt + 30_000)
    assert.equal(room.phase, 'finished'); assert.deepEqual(view(room, startAt + 30_000).players.map((player) => player.rank), [1, 1])
  })
  await test('pause freezes the response allowance and speed score; neither answers nor progression bypass it', () => {
    let room = step(ready(), { type: 'pause' }, startAt + 2000)
    assert.equal(room.remainingMs, 8000)
    assert.equal(step(room, { type: 'tick' }, startAt + 40_000), room)
    assert.throws(() => step(room, { type: 'answer', playerId: 'p1', questionId: 'q1', choiceId: 'c0' }, startAt + 40_000), /pause/)
    room = step(room, { type: 'resume' }, startAt + 40_000)
    room = step(room, { type: 'answer', playerId: 'p1', questionId: 'q1', choiceId: 'c0' }, startAt + 41_000)
    room = step(room, { type: 'next' }, startAt + 41_000)
    assert.equal(room.players[0].score, 850)
  })
  await test('untimed competition waits for answers and awards exact points without a speed bonus', () => {
    let room = ready('online', { enabled: false })
    assert.equal(step(room, { type: 'tick' }, startAt + 600_000), room)
    room = step(room, { type: 'answer', playerId: 'p1', questionId: 'q1', choiceId: 'c0' }, startAt + 600_000)
    room = step(room, { type: 'next' }, startAt + 600_000)
    assert.equal(room.players[0].score, 1000); assert.equal(room.players[1].score, 0)
    assert.equal(pointsFor(true, 9000, { ...settings, speedPoints: false }), 1000)
  })
  await test('offline turns hide prior responses, start the timer only after handoff and delay correction until everyone played', () => {
    let room = ready('local')
    assert.equal(room.phase, 'handoff'); assert.equal(view(room, startAt).question, undefined)
    room = step(room, { type: 'begin-turn' }, startAt + 20_000)
    room = step(room, { type: 'answer', playerId: 'p1', questionId: 'q1', choiceId: 'c0' }, startAt + 22_000)
    assert.equal(room.phase, 'handoff'); assert.equal(room.turn, 1); assert.equal(view(room, startAt + 22_000).question, undefined)
    assert.equal(room.players[0].score, 0)
    room = step(room, { type: 'begin-turn' }, startAt + 50_000)
    assert.throws(() => step(room, { type: 'answer', playerId: 'p1', questionId: 'q1', choiceId: 'c1' }, startAt + 50_100), /déjà/)
    room = step(room, { type: 'tick' }, startAt + 60_000)
    assert.equal(room.phase, 'correction'); assert.deepEqual(room.players.map((player) => player.score), [900, 0])
    room = step(room, { type: 'tick' }, startAt + 65_000)
    assert.equal(room.phase, 'handoff'); assert.equal(room.turn, 0); assert.equal(room.index, 1)
  })
  await test('room limits, fixed mascots, source keys and media origins are validated without mutating the submitted quiz', () => {
    const copy = structuredClone(quiz)
    assert.deepEqual(parseCompetitionQuiz(quiz), quiz)
    const dirty = structuredClone(quiz); dirty.items[0].question.correct = true; dirty.items[0].question.nickname = 'untrusted'
    const sanitized = parseCompetitionQuiz(dirty)
    assert.ok(!JSON.stringify(sanitized.items[0].question).includes('nickname')); assert.ok(!Object.hasOwn(sanitized.items[0].question, 'correct'))
    const remote = structuredClone(quiz); remote.items[0].question.images = ['https://other.example/image.png']
    assert.throws(() => parseCompetitionQuiz(remote, ['https://class.example']), /origine/)
    assert.throws(() => parseCompetitionQuiz({ ...quiz, items: [...quiz.items, quiz.items[0]] }), /invalides/)
    assert.throws(() => parseCompetitionQuiz({ ...quiz, items: [{ ...quiz.items[0], correctChoiceId: 'foreign' }] }), /vérifiable/)
    assert.throws(() => step(createCompetition(quiz, settings, 'online', '123456', startAt), { type: 'join', avatarId: 'untrusted' }, startAt), /mascotte/)
    assert.throws(() => step(ready(), { type: 'join', avatarId: 'panda' }, startAt), /commencé/)
    assert.throws(() => step(ready(), { type: 'tick' }, startAt + ROOM_LIFETIME), /expiré/)
    assert.deepEqual(quiz, copy)
  })
} finally { await server.close() }
