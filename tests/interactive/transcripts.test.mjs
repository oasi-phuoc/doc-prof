import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  const { sourceTranscript, reviewTranscript } = await server.ssrLoadModule('/src/interactive/domain/transcripts.ts')
  const { convertRecipe } = await server.ssrLoadModule('/src/interactive/domain/convert.ts')
  const { demoRecipe } = await server.ssrLoadModule('/src/interactive/demo.ts')
  const { defaultPage } = await server.ssrLoadModule('/src/math/catalog.ts')
  const { buildWorksheets } = await server.ssrLoadModule('/src/math/generate.ts')
  const { prepareGame } = await server.ssrLoadModule('/src/interactive/domain/plan.ts')
  const { startSession, transition } = await server.ssrLoadModule('/src/interactive/domain/session.ts')
  const { compactSession, newRecord, replaySession, planIdentity } = await server.ssrLoadModule('/src/interactive/domain/persistence.ts')
  const { competitionQuiz, createCompetition, competitionView } = await server.ssrLoadModule('/src/interactive/competition/core.ts')
  const { PALETTE, defaultShapes } = await server.ssrLoadModule('/src/interactive/domain/palette.ts')
  const mono = { audio: 'tcf/ecoute.mp3', transcription: '  Bonjour. Le rendez-vous est à midi.\nMerci.  ' }
  const multi = { audios: ['/one.mp3', '', '/two.mp3'], transcription: ['Premier dialogue.', '', 'Deuxième dialogue.'] }
  const question = (id, audio = 1) => ({ id, audio, enonce: `Question ${id} ?`, type_reponse: 'qcm_texte', choix: [{ id: 'a', texte: 'midi', correct: true }, { id: 'b', texte: 'le soir', correct: false }, { id: 'c', texte: 'demain', correct: false }] })
  const ex = { id: 'transcript-fixture', niveau: 'A1', competence: 'CO', type_exercice: 'complet', theme: 'Rendez-vous', consigne: 'Écoutez et répondez.', support: mono, questions: [question('un'), question('deux')] }
  const recipe = exercise => ({ ...demoRecipe(), pages: [{ ...defaultPage('tcf-csc'), topic: 'tcf-co', exerciseType: 'tcf-co-ex-3', count: 1, tcfExercise: exercise, libreItems: undefined }], libreMode: false })
  const game = convertRecipe(recipe(ex))
  const reveal = (game, state) => ['CARDS_UP', 'DISCUSS', 'REVEAL'].reduce((value, type) => transition(game, value, { type }, 1000), state)
  const answer = (game, state) => transition(game, state, { type: 'SELECT', questionId: game.questions[state.index].id, choiceId: game.corrections[game.questions[state.index].id].choiceId })

  await test('only the exact mono recording gets its stored transcript, without interpreting filenames or replacement aliases', async () => {
    assert.equal(sourceTranscript(mono, '/lib/audio/tcf/ecoute.mp3'), mono.transcription.trim())
    assert.equal(sourceTranscript(mono, 'tcf/ecoute.mp3'), mono.transcription.trim())
    for (const src of [undefined, '', '/other.mp3']) assert.equal(sourceTranscript(mono, src), undefined)
    assert.equal(sourceTranscript({ ...mono, transcription: '' }, mono.audio), undefined)
    assert.equal(sourceTranscript({ audio: mono.audio }, mono.audio), undefined)
    assert.equal(sourceTranscript(mono, mono.audio, [mono.audio, '/other.mp3']), undefined)
    const aliases = JSON.parse(await readFile('src/tcf/content/audio-replacements.json', 'utf8'))
    const [old, replacement] = Object.entries(aliases)[0]
    assert.equal(sourceTranscript({ audio: old, transcription: 'Ancienne version.' }, replacement), undefined)
  })

  await test('multi-track texts keep their original positions and ambiguous common or duplicate transcripts stay hidden', () => {
    assert.equal(sourceTranscript(multi, '/one.mp3'), 'Premier dialogue.')
    assert.equal(sourceTranscript(multi, '/two.mp3'), 'Deuxième dialogue.')
    assert.equal(sourceTranscript({ ...multi, transcription: 'Texte commun non découpé.' }, '/two.mp3'), undefined)
    assert.equal(sourceTranscript({ ...multi, transcription: ['Un seul texte.'] }, '/two.mp3'), undefined)
    assert.equal(sourceTranscript({ audios: ['/same.mp3', '/same.mp3'], transcription: ['A', 'B'] }, '/same.mp3'), undefined)
    assert.equal(sourceTranscript({ audios: ['/same.mp3', '/same.mp3'], transcription: ['A', 'A'] }, '/same.mp3'), 'A')
  })

  await test('conversion preserves paper, questions and answers while keeping bank transcripts only with private corrections', () => {
    const input = recipe({ ...ex, support: { audios: ['/one.mp3', '/two.mp3'], transcription: ['Premier dialogue.', 'Deuxième dialogue.'] }, questions: [question('one', 1), question('two', 2)] })
    const before = structuredClone(input), paper = structuredClone(buildWorksheets(input.pages, input.seed))
    const converted = convertRecipe(input)
    assert.equal(converted.questions.length, 2)
    assert.deepEqual(converted.questions.map(q => converted.corrections[q.id].transcript), ['Premier dialogue.', 'Deuxième dialogue.'])
    assert.ok(!JSON.stringify(converted.questions).includes('dialogue.'))
    assert.ok(converted.questions.every(q => q.choices.some(choice => choice.id === converted.corrections[q.id].choiceId)))
    assert.deepEqual(buildWorksheets(input.pages, input.seed), paper)
    assert.deepEqual(input, before)
    assert.deepEqual(convertRecipe(input), converted)
  })

  await test('real CO banks at all three levels copy each track verbatim, including tracks with several selected questions', async () => {
    let checked = 0, tracks = new Set()
    for (const [level, domain] of [['a0-a1', 'tcf-csc'], ['a1-a2', 'tcf-cfr'], ['a2-b1', 'tpf']]) {
      const bank = JSON.parse(await readFile(`src/tcf/content/${level}/co.json`, 'utf8'))
      const samples = bank.filter(item => item.type_exercice === 'complet' && item.questions.length && item.support.transcription).slice(0, 3)
      for (const original of samples) {
        const input = recipe(original); input.pages[0].domain = domain
        const converted = convertRecipe(input)
        assert.ok(converted.questions.length > 0, original.id)
        const refs = original.support.audios?.length ? original.support.audios : [original.support.audio]
        for (const q of converted.questions) {
          const index = refs.findIndex(src => (src?.startsWith('/') ? src : '/lib/audio/' + src) === q.audio)
          assert.ok(index >= 0, `${original.id}: ${q.audio}`)
          const expected = Array.isArray(original.support.transcription) ? original.support.transcription[index] : refs.length === 1 ? original.support.transcription : undefined
          assert.equal(converted.corrections[q.id].transcript, expected?.trim() || undefined)
          assert.ok(!('transcript' in q))
          checked++; tracks.add(q.audio)
        }
      }
    }
    assert.ok(checked >= 50); assert.ok(tracks.size >= 10)
  })

  await test('Solo review waits for all retained questions; Classe review opens after the shared round is revealed', () => {
    assert.equal(game.questions.length, 2)
    const solo = prepareGame(game, undefined, 'solo')
    let state = startSession(solo, 'solo')
    assert.equal(reviewTranscript(solo, state), undefined)
    state = answer(solo, state)
    assert.equal(reviewTranscript(solo, state), undefined)
    state = transition(solo, state, { type: 'NEXT' })
    assert.equal(reviewTranscript(solo, state), undefined)
    state = answer(solo, state)
    assert.equal(reviewTranscript(solo, state), mono.transcription.trim())
    const partial = prepareGame(game, [game.questions[1].id], 'solo')
    assert.equal(reviewTranscript(partial, answer(partial, startSession(partial, 'solo'))), mono.transcription.trim())
    const collective = prepareGame(game)
    assert.equal(collective.rounds.length, 1)
    assert.equal(reviewTranscript(collective, reveal(collective, startSession(collective))), mono.transcription.trim())
  })

  await test('skipping cannot unlock the text, and retry, retraction and navigation recalculate access from current results', () => {
    const solo = prepareGame(game, undefined, 'solo')
    let state = transition(solo, startSession(solo, 'solo'), { type: 'SKIP' })
    state = answer(solo, state)
    assert.equal(reviewTranscript(solo, state), undefined)
    state = transition(solo, state, { type: 'NAVIGATE', index: 0 })
    state = answer(solo, state)
    assert.equal(reviewTranscript(solo, state), mono.transcription.trim())
    const collective = prepareGame(game)
    const revealed = reveal(collective, startSession(collective))
    const retracted = transition(collective, revealed, { type: 'UNREVEAL', roundId: collective.rounds[0].id }, revealed.revealedAt + 1)
    assert.equal(retracted.phase, 'discussion')
    assert.equal(reviewTranscript(collective, retracted), undefined)
    assert.equal(reviewTranscript(collective, transition(collective, revealed, { type: 'RETRY_QUESTION', roundId: collective.rounds[0].id })), undefined)
  })

  await test('journal replay restores eligibility without storing source texts or the reading window', async () => {
    const collective = prepareGame(game), state = reveal(collective, startSession(collective))
    const legacy = structuredClone(collective)
    for (const correction of Object.values(legacy.corrections)) delete correction.transcript
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify({ version: 1, game: legacy, rounds: legacy.rounds })))
    const legacyPlanId = Buffer.from(digest).toString('hex')
    assert.equal(await planIdentity(collective), legacyPlanId)
    const record = compactSession(await newRecord(legacy), state)
    const resumed = replaySession(collective, record, await planIdentity(collective))
    assert.equal(reviewTranscript(collective, resumed.state), mono.transcription.trim())
    const wrongKey = structuredClone(collective); wrongKey.corrections[wrongKey.questions[0].id].choiceId = 'changed'
    assert.notEqual(await planIdentity(wrongKey), legacyPlanId)
    assert.ok(!JSON.stringify(record).includes(mono.transcription.trim()))
    assert.ok(!JSON.stringify(record).includes('readingTranscript'))
  })

  await test('relative and absolute references cannot bypass pending questions, while other recordings do not block review', () => {
    const input = structuredClone(game)
    input.questions[0].audio = mono.audio
    input.questions.push({ ...input.questions[1], id: 'other-recording', audio: '/other.mp3' })
    input.corrections['other-recording'] = { choiceId: input.corrections[input.questions[1].id].choiceId, text: 'midi', transcript: 'Autre enregistrement.' }
    let state = answer(input, startSession(input, 'solo'))
    assert.equal(reviewTranscript(input, state), undefined)
    state = answer(input, transition(input, state, { type: 'NEXT' }))
    assert.equal(reviewTranscript(input, state), mono.transcription.trim())
  })

  await test('conflicting metadata stays hidden and neither competition quizzes nor player views contain private transcripts', () => {
    const collective = prepareGame(game), state = reveal(collective, startSession(collective))
    const conflict = structuredClone(collective)
    conflict.corrections[conflict.questions[1].id].transcript = 'Autre version.'
    assert.equal(reviewTranscript(conflict, state), undefined)
    const quiz = competitionQuiz(game, 'https://clairfle.test')
    assert.ok(!JSON.stringify(quiz).includes('transcript')); assert.ok(!JSON.stringify(quiz).includes('rendez-vous'))
    const room = createCompetition(quiz, { enabled: false, seconds: 30, feedbackSeconds: 3, speedPoints: false }, 'local', 'ABC234', 1000, PALETTE.map(c => c.color), [...defaultShapes])
    assert.ok(!JSON.stringify(competitionView(room, 1000)).includes('transcript'))
    assert.equal(reviewTranscript({ ...collective, corrections: {} }, state), undefined)
  })
} finally { await server.close() }
