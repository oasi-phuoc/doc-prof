import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { test } from 'node:test'
import { createServer } from 'vite'

const vite = await createServer({ cacheDir: '/tmp/clairfle-console-unit', server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  const { TeacherConsoleController } = await vite.ssrLoadModule('/src/interactive/teacher-console/controller.ts')
  const { CONSOLE_PROTOCOL, consoleAddress, consoleChannel, readConsoleRequest, teacherSnapshot } = await vite.ssrLoadModule('/src/interactive/teacher-console/protocol.ts')
  const { startSession, transition } = await vite.ssrLoadModule('/src/interactive/domain/session.ts')
  const { PALETTE, defaultShapes } = await vite.ssrLoadModule('/src/interactive/domain/palette.ts')
  const source = { page: 1, block: 1, item: 1, part: 0, exerciseType: 'fixture' }
  const choice = id => ({ id, title: 'Calcul', instruction: 'Calculez.', prompt: id === 'q1' ? '2 + 2 = ?' : '3 + 3 = ?', source, mode: 'choice', compatibility: 'auto', images: [], choices: [{ id: 'wrong-1', text: '3' }, { id: 'key', text: id === 'q1' ? '4' : '6' }, { id: 'wrong-2', text: '5' }] })
  const game = { id: 'console-fixture', seed: 17, title: 'Calculs et récit', questions: [choice('q1'), { id: 'oral', title: 'Récit', instruction: 'Racontez la scène.', prompt: 'Que se passe-t-il ?', source: { ...source, item: 2 }, mode: 'oral', compatibility: 'teacher-led', images: [], choices: [], hints: ['Où est la personne ?', 'Que fait-elle ensuite ?'] }, choice('q3')], corrections: { q1: { choiceId: 'key', text: 'Deux et deux font quatre.' }, q3: { choiceId: 'key', text: 'Trois et trois font six.' }, oral: { text: 'MODÈLE PRIVÉ : La cycliste demande de l’aide.\nUne autre réponse peut convenir.', transcript: 'TRANSCRIPTION PRIVÉE complète.' } }, issues: [] }
  const view = () => ({ available: true, blocked: false, guard: 'none', colors: PALETTE.map(p => p.color), shapes: [...defaultShapes] })
  function fixture(input = game, mode = 'class', guard = 'none') {
    let state = startSession(input, mode), setting = { ...view(), guard }, time = 0, serial = 0
    const timers = new Map(), messages = [], events = [], dialogs = [], session = randomUUID()
    const clock = { now: () => time, setTimeout: (callback, delay) => { const id = ++serial; timers.set(id, { callback, at: time + delay }); return id }, clearTimeout: id => timers.delete(id) }
    const host = new TeacherConsoleController(session, () => ({ game: input, state, view: setting }), action => { events.push(action); state = transition(input, state, action, time) }, message => messages.push(message), clock, open => dialogs.push(open))
    const envelope = () => ({ protocol: CONSOLE_PROTOCOL, session, type: 'command', id: randomUUID(), revision: host.snapshot().revision })
    const command = (command, revision) => {
      if (['skip', 'finish', 'retry'].includes(command.name)) host.receive({ ...envelope(), command: { name: 'confirm-start', action: command.name }, ...(revision === undefined ? {} : { revision }) })
      const request = { ...envelope(), command, ...(revision === undefined ? {} : { revision }) }; host.receive(request); return request
    }
    const tick = elapsed => { const end = time + elapsed; for (;;) { const next = [...timers.entries()].sort((a, b) => a[1].at - b[1].at)[0]; if (!next || next[1].at > end) break; time = next[1].at; timers.delete(next[0]); next[1].callback() } time = end }
    return { host, session, messages, events, dialogs, timers, envelope, command, tick, state: () => state, setState: next => { state = next }, setView: next => { setting = { ...setting, ...next } } }
  }

  await test('console addresses and requests reject malformed, cross-session and arbitrary reducer payloads', () => {
    const session = randomUUID(), token = randomUUID(), valid = { protocol: CONSOLE_PROTOCOL, session, type: 'command', id: randomUUID(), revision: 1, command: { name: 'pause' } }
    assert.deepEqual(consoleAddress(`#${session}/${token}`), { session, token })
    assert.ok(consoleChannel({ session, token }).includes(session))
    for (const hash of ['', '#one/two', `#${session}/${token}/extra`, `#${session}%2F${token}`, `#${session}/../../bad`]) assert.equal(consoleAddress(hash), undefined)
    assert.deepEqual(readConsoleRequest(valid, session), valid)
    for (const value of [null, [], { ...valid, session: randomUUID() }, { ...valid, protocol: 'other' }, { ...valid, revision: -1 }, { ...valid, revision: NaN }, { ...valid, revision: 1.5 }, { ...valid, revision: Infinity }, { ...valid, id: 'replayed' }, { ...valid, state: { finished: true } }, { ...valid, command: { type: 'SELECT', choiceId: 'key' } }, { ...valid, command: { name: 'SELECT' } }, { ...valid, command: { name: 'pause', choiceId: 'key' } }, { ...valid, command: { name: 'navigate', index: -1 } }, { ...valid, command: { name: 'navigate', index: '1' } }, { ...valid, command: { name: 'assess', questionId: 'q1', value: 'correct' } }]) assert.equal(readConsoleRequest(value, session), undefined, JSON.stringify(value))
  })

  await test('the private snapshot keeps exact paired slots, source models, transcripts and hints without changing projection data', () => {
    const paired = { ...structuredClone(game), rounds: [{ id: 'paired', questionIds: ['q1', 'q3'] }, { id: 'oral-round', questionIds: ['oral'] }] }, before = structuredClone(paired)
    const state = startSession(paired), custom = { ...view(), colors: ['#ffffff', '#f6e5a2', '#ffffff', '#ffffff', '#bfd7f2', '#ffffff'], shapes: ['circle', 'hexagon', 'square', 'triangle', 'heart', 'star'] }
    const snapshot = teacherSnapshot(paired, state, custom, randomUUID(), 1, 0)
    assert.equal(snapshot.progress, 'Questions 1 et 2 / 3')
    assert.deepEqual(snapshot.questions.map(q => [q.answer.letter, q.answer.text, q.answer.shape, q.answer.color]), [['B', '4', 'hexagon', '#f6e5a2'], ['E', '6', 'heart', '#bfd7f2']])
    const oral = teacherSnapshot(paired, transition(paired, state, { type: 'NAVIGATE', index: 1 }), custom, randomUUID(), 2, 0)
    assert.equal(oral.questions[0].model, paired.corrections.oral.text); assert.equal(oral.questions[0].transcript, paired.corrections.oral.transcript); assert.deepEqual(oral.questions[0].hints, paired.questions[1].hints)
    assert.ok(!JSON.stringify(paired.questions).includes('MODÈLE PRIVÉ')); assert.deepEqual(paired, before)
    assert.deepEqual(teacherSnapshot(paired, state, { ...custom, available: false }, randomUUID(), 3, 0).questions, [])
  })

  await test('the projection applies typed commands once, rejects stale frames and preserves navigated phases and attempts', () => {
    const f = fixture(), before = structuredClone(game), first = f.host.snapshot()
    const accepted = f.command({ name: 'cards-up' }); assert.equal(f.state().phase, 'cards-up')
    f.host.receive(accepted); assert.equal(f.events.length, 1)
    f.command({ name: 'discuss' }, first.revision); assert.equal(f.state().phase, 'cards-up')
    f.command({ name: 'discuss' }); f.command({ name: 'reveal' }); assert.equal(f.state().phase, 'revealed'); assert.equal(f.state().history.length, 1)
    f.command({ name: 'retry' }); assert.equal(f.state().phase, 'thinking'); assert.equal(f.state().previousAttempts.length, 1)
    assert.equal(f.host.snapshot().attempt, 1); assert.notEqual(f.host.snapshot().questions[0].answer.letter, first.questions[0].answer.letter)
    f.command({ name: 'cards-up' }); f.command({ name: 'navigate', index: 1 }); assert.equal(f.state().index, 1)
    f.command({ name: 'navigate', index: 0 }); assert.equal(f.state().phase, 'cards-up'); assert.equal(f.host.snapshot().attempt, 1)
    const count = f.events.length
    f.command({ name: 'navigate', index: 99999 }); f.host.receive({ ...f.envelope(), command: { name: 'SELECT', choiceId: 'key' } }); assert.equal(f.events.length, count)
    assert.deepEqual(game, before); assert.ok(f.messages.some(message => message.type === 'ack' && !message.accepted))
  })

  await test('pause, lock, local dialogs, Solo and lost ownership block remote transitions without transferring authority', () => {
    const f = fixture()
    f.command({ name: 'lock' }); f.command({ name: 'cards-up' }); assert.equal(f.state().phase, 'thinking'); assert.deepEqual(f.host.snapshot().commands, ['unlock'])
    f.command({ name: 'unlock' }); f.command({ name: 'pause' }); f.command({ name: 'cards-up' }); assert.ok(f.state().paused); assert.equal(f.state().phase, 'thinking')
    f.command({ name: 'resume' }); f.setView({ blocked: true }); f.command({ name: 'cards-up' }); assert.equal(f.state().phase, 'thinking')
    f.setView({ blocked: false }); f.command({ name: 'cards-up' }); assert.equal(f.state().phase, 'cards-up')
    f.setView({ available: false }); f.command({ name: 'discuss' }); assert.equal(f.state().phase, 'cards-up'); assert.deepEqual(f.host.snapshot().questions, [])
    const solo = fixture(game, 'solo'); solo.command({ name: 'reveal' }); solo.command({ name: 'pause' }); assert.equal(solo.events.length, 0); assert.deepEqual(solo.host.snapshot().questions, [])
  })

  await test('held reveal is measured in the projection, cancels on release or context change, and cannot be bypassed', () => {
    const f = fixture(game, 'class', 'hold-to-reveal')
    f.command({ name: 'cards-up' }); f.command({ name: 'discuss' })
    f.command({ name: 'reveal' }); assert.equal(f.state().phase, 'discussion')
    f.command({ name: 'reveal-start' }); f.tick(350); f.command({ name: 'reveal-cancel' }); f.tick(1000); assert.equal(f.state().phase, 'discussion')
    f.command({ name: 'reveal-start' }); f.tick(599); assert.equal(f.state().phase, 'discussion'); f.tick(1); assert.equal(f.state().phase, 'revealed')
    assert.equal(f.state().history.length, 1); f.command({ name: 'unreveal' }); assert.equal(f.state().phase, 'discussion')
    for (const change of [{ available: false }, { blocked: true }]) {
      f.setView({ available: true, blocked: false }); f.command({ name: 'reveal-start' }); f.tick(300); f.setView(change); f.tick(500); assert.equal(f.state().phase, 'discussion')
    }
    f.setView({ available: true, blocked: false }); f.command({ name: 'reveal-start' }); f.command({ name: 'pause' }); f.tick(700); assert.equal(f.state().phase, 'discussion'); assert.ok(f.state().paused)
  })

  await test('revealed models retain human assessment and bounded hints; retraction expires and finishing remains a projection action', () => {
    const f = fixture(); f.command({ name: 'navigate', index: 1 })
    f.command({ name: 'hint', questionId: 'oral' }); assert.equal(f.events.filter(e => e.type === 'HINT_SHOW').length, 0)
    f.command({ name: 'cards-up' }); f.command({ name: 'hint', questionId: 'q1' }); f.command({ name: 'hint', questionId: 'oral' }); assert.equal(f.host.snapshot().questions[0].shownHints, 1)
    f.command({ name: 'hint', questionId: 'oral' }); f.command({ name: 'hint', questionId: 'oral' }); assert.equal(f.host.snapshot().questions[0].shownHints, 2)
    f.command({ name: 'assess', questionId: 'oral', value: 'acquired' }); assert.equal(f.state().history.length, 0)
    f.command({ name: 'discuss' }); f.command({ name: 'reveal' }); f.command({ name: 'assess', questionId: 'q1', value: 'acquired' }); assert.equal(f.state().history[0].manual, undefined)
    f.command({ name: 'assess', questionId: 'oral', value: 'acquired' }); assert.equal(f.state().history[0].manual, 'acquired'); assert.equal(f.state().history[0].correct, undefined)
    f.tick(10000); f.command({ name: 'unreveal' }); assert.equal(f.state().phase, 'revealed')
    f.command({ name: 'finish' }); assert.ok(f.state().finished); assert.equal(f.state().history.find(q => q.questionId === 'oral').manual, 'acquired'); assert.equal(f.state().history.filter(q => q.skipped).length, 2); assert.deepEqual(f.host.snapshot().commands, [])
  })

  await test('independent sessions ignore each other, and closing either endpoint cancels pending holds', () => {
    const a = fixture(game, 'class', 'hold-to-reveal'), b = fixture()
    b.host.receive({ ...a.envelope(), command: { name: 'cards-up' } }); assert.equal(b.events.length, 0)
    a.command({ name: 'cards-up' }); a.command({ name: 'discuss' }); a.command({ name: 'reveal-start' })
    a.host.receive({ protocol: CONSOLE_PROTOCOL, session: a.session, type: 'bye' }); a.tick(1000); assert.equal(a.state().phase, 'discussion')
    a.command({ name: 'reveal-start' }); a.host.dispose(); a.tick(1000); assert.equal(a.state().phase, 'discussion'); assert.equal(a.timers.size, 0)
    const count = a.events.length; a.command({ name: 'finish' }); assert.equal(a.events.length, count); assert.equal(a.messages.at(-1).type, 'closed')
    b.command({ name: 'cards-up' }); assert.equal(b.state().phase, 'cards-up')
    const c = fixture()
    c.host.receive({ ...c.envelope(), command: { name: 'finish' } }); assert.equal(c.state().finished, false)
    c.command({ name: 'confirm-start', action: 'skip' }); assert.deepEqual(c.dialogs, [true]); assert.equal(c.events.length, 0)
    c.command({ name: 'cards-up' }); assert.equal(c.state().phase, 'thinking')
    c.command({ name: 'confirm-cancel' }); assert.deepEqual(c.dialogs, [true, false]); assert.equal(c.events.length, 0)
    c.command({ name: 'confirm-start', action: 'finish' }); c.host.receive({ protocol: CONSOLE_PROTOCOL, session: c.session, type: 'bye' }); assert.deepEqual(c.dialogs.slice(-2), [true, false]); assert.equal(c.state().finished, false)
    c.command({ name: 'confirm-start', action: 'skip' }); c.setState(transition(game, c.state(), { type: 'CARDS_UP' })); c.host.publish(); assert.deepEqual(c.dialogs.slice(-2), [true, false])
    c.host.receive({ ...c.envelope(), command: { name: 'skip' } }); assert.equal(c.state().index, 0)
    c.command({ name: 'confirm-start', action: 'finish' }); c.host.dispose(); assert.deepEqual(c.dialogs.slice(-2), [true, false])
  })
} finally { await vite.close() }
