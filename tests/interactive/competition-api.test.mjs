import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createServer } from 'vite'
const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
const actualNow = Date.now
let now = 200_000
Date.now = () => now
try {
  const { ClassroomCompetitionRoom, handleCompetitionRequest } = await server.ssrLoadModule('/api/fiches/src/competition.ts')
  const origin = 'https://class.example', teacherKey = `test-only-${crypto.randomUUID()}`
  const quiz = { id: 'fixture', title: 'Quiz', items: [{ question: { id: 'q1', prompt: '2 + 2 = ?', images: [], choices: [{ id: 'c0', text: '4' }, { id: 'c1', text: '5' }] }, correctChoiceId: 'c0' }, { question: { id: 'q2', prompt: '3 + 3 = ?', images: [], choices: [{ id: 'c0', text: '6' }, { id: 'c1', text: '7' }] }, correctChoiceId: 'c0' }] }
  const settings = { enabled: true, seconds: 10, feedbackSeconds: 5, speedPoints: true }
  function harness() {
    const objects = new Map(), stores = new Map()
    function instance(code) {
      if (!stores.has(code)) stores.set(code, { data: new Map(), alarm: undefined, get value() { const parts = this.data.get('room-parts')?.parts; return parts ? JSON.parse(Array.from({ length: parts }, (_, i) => this.data.get(`room-${i}`)).join('')) : undefined } })
      const entry = stores.get(code)
      return new ClassroomCompetitionRoom({ storage: { get: async (key) => structuredClone(entry.data.get(key)), put: async (key, value) => { if (typeof key === 'string') entry.data.set(key, structuredClone(value)); else for (const [name, item] of Object.entries(key)) entry.data.set(name, structuredClone(item)) }, deleteAll: async () => { entry.data.clear() }, setAlarm: async (at) => { entry.alarm = at } }, blockConcurrencyWhile: (fn) => fn() })
    }
    const env = { COMPETITION_HOST_KEY: teacherKey, COMPETITION_ORIGINS: origin, COMPETITION_ROOMS: { idFromName: (name) => name, get: (code) => ({ fetch: (request) => { if (!objects.has(code)) objects.set(code, instance(code)); return objects.get(code).fetch(request) } }) } }
    async function request(path, method = 'GET', data, token, requestOrigin = origin) {
      const headers = { Origin: requestOrigin, ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(data === undefined ? {} : { 'Content-Type': 'application/json' }) }
      const response = await handleCompetitionRequest(new Request(`https://api.example/competition${path}`, { method, headers, ...(data === undefined ? {} : { body: JSON.stringify(data) }) }), env)
      return { status: response.status, headers: response.headers, body: await response.json() }
    }
    return { env, stores, objects, request, restart: (code) => objects.set(code, instance(code)) }
  }
  async function room() {
    const h = harness(), created = await h.request('/rooms', 'POST', { quiz, settings }, teacherKey)
    assert.equal(created.status, 201)
    const { code, token } = created.body
    return { ...h, code, host: token }
  }
  await test('creation requires a server-only teacher key, rejects foreign origins and fails closed without configuration', async () => {
    const h = harness()
    assert.equal((await h.request('/rooms', 'POST', { quiz, settings })).status, 401)
    assert.equal((await h.request('/rooms', 'POST', { quiz, settings }, 'invalid')).status, 401)
    const foreign = await h.request('/rooms', 'POST', { quiz, settings }, teacherKey, 'https://other.example')
    assert.equal(foreign.status, 403); assert.equal(foreign.headers.get('Access-Control-Allow-Origin'), null)
    const unavailable = await handleCompetitionRequest(new Request('https://api.example/competition/rooms'), { COMPETITION_ORIGINS: origin })
    assert.equal(unavailable.status, 503)
  })
  await test('joining asks for a fixed mascot only; neither nicknames nor arbitrary mascot strings reach shared state', async () => {
    const h = await room()
    for (const body of [{ avatarId: 'panda', nickname: 'untrusted' }, { avatarId: 'untrusted' }]) assert.equal((await h.request(`/rooms/${h.code}/join`, 'POST', body)).status, 400)
    const joined = await h.request(`/rooms/${h.code}/join`, 'POST', { avatarId: 'panda' })
    assert.equal(joined.status, 201); assert.match(joined.body.token, /^[a-f0-9]{64}$/)
    assert.equal(joined.body.view.players[0].avatarId, 'panda')
    assert.ok(!JSON.stringify(joined.body.view).includes('nickname'))
    const stored = h.stores.get(h.code).value
    assert.ok(!JSON.stringify(stored).includes(joined.body.token)); assert.ok(!JSON.stringify(stored).includes(h.host))
  })
  await test('participant capabilities cannot control the host, change another vote, forge a clock or submit a score', async () => {
    const h = await room(), joined = await h.request(`/rooms/${h.code}/join`, 'POST', { avatarId: 'fox' }), player = joined.body.token
    assert.equal((await h.request(`/rooms/${h.code}/host`, 'POST', { action: 'start' }, player)).status, 403)
    assert.equal((await h.request(`/rooms/${h.code}`)).status, 401)
    await h.request(`/rooms/${h.code}/host`, 'POST', { action: 'start' }, h.host)
    for (const extra of [{ score: 9999 }, { elapsedMs: 0 }, { playerId: 'p2' }]) assert.equal((await h.request(`/rooms/${h.code}/answer`, 'POST', { questionId: 'q1', choiceId: 'c0', ...extra }, player)).status, 400)
    assert.equal((await h.request(`/rooms/${h.code}?token=untrusted`, 'GET', undefined, player)).status, 400)
  })
  await test('concurrent answers score once, stay private until reveal and survive durable-object restart', async () => {
    const h = await room()
    const first = (await h.request(`/rooms/${h.code}/join`, 'POST', { avatarId: 'panda' })).body
    const second = (await h.request(`/rooms/${h.code}/join`, 'POST', { avatarId: 'tiger' })).body
    await h.request(`/rooms/${h.code}/host`, 'POST', { action: 'start' }, h.host)
    now += 2000
    const once = await h.request(`/rooms/${h.code}/answer`, 'POST', { questionId: 'q1', choiceId: 'c0' }, first.token)
    assert.equal(once.body.view.phase, 'question'); assert.equal(once.body.view.correctChoiceId, undefined)
    const other = (await h.request(`/rooms/${h.code}`, 'GET', undefined, second.token)).body.view
    assert.equal(other.self.selected, undefined); assert.equal(other.players[0].score, 0); assert.equal(other.question.id, 'q1')
    assert.ok(!JSON.stringify(other).includes('q2')); assert.ok(!Object.hasOwn(other, 'quiz'))
    const replies = await Promise.all([h.request(`/rooms/${h.code}/answer`, 'POST', { questionId: 'q1', choiceId: 'c0' }, second.token), h.request(`/rooms/${h.code}/answer`, 'POST', { questionId: 'q1', choiceId: 'c0' }, first.token)])
    assert.ok(replies.every((reply) => reply.status === 200))
    h.restart(h.code)
    const recovered = await h.request(`/rooms/${h.code}`, 'GET', undefined, first.token)
    assert.equal(recovered.body.view.correctChoiceId, 'c0'); assert.deepEqual(recovered.body.view.players.map((player) => player.score), [900, 900])
    assert.equal(recovered.body.view.players[1].rank, 1)
    assert.equal(recovered.headers.get('Cache-Control'), 'no-store'); assert.equal(recovered.headers.get('Access-Control-Allow-Origin'), origin)
  })
  await test('removed participants lose access; alarms progress the game and erase expired content and capabilities', async () => {
    const h = await room(), first = (await h.request(`/rooms/${h.code}/join`, 'POST', { avatarId: 'koala' })).body
    await h.request(`/rooms/${h.code}/host`, 'POST', { action: 'remove', playerId: first.playerId }, h.host)
    assert.equal((await h.request(`/rooms/${h.code}`, 'GET', undefined, first.token)).status, 401)
    const second = (await h.request(`/rooms/${h.code}/join`, 'POST', { avatarId: 'koi' })).body
    await h.request(`/rooms/${h.code}/host`, 'POST', { action: 'start' }, h.host)
    now += 10_000; await h.objects.get(h.code).alarm()
    assert.equal(h.stores.get(h.code).value.room.phase, 'correction')
    now += 5000; await h.objects.get(h.code).alarm()
    assert.equal(h.stores.get(h.code).value.room.index, 1)
    now = h.stores.get(h.code).value.room.expiresAt; await h.objects.get(h.code).alarm()
    assert.equal(h.stores.get(h.code).value, undefined)
    assert.equal((await h.request(`/rooms/${h.code}`, 'GET', undefined, second.token)).status, 404)
  })
  await test('teacher-key guessing is limited durably per address, with a one-minute reset', async () => {
    const h = harness()
    for (let i = 0; i < 10; i++) assert.equal((await h.request('/rooms', 'POST', { quiz, settings }, 'invalid')).status, 401)
    assert.equal((await h.request('/rooms', 'POST', { quiz, settings }, 'invalid')).status, 429)
    for (const key of h.objects.keys()) h.restart(key)
    assert.equal((await h.request('/rooms', 'POST', { quiz, settings }, 'invalid')).status, 429)
    now += 60_001
    assert.equal((await h.request('/rooms', 'POST', { quiz, settings }, teacherKey)).status, 201)
  })
  await test('a quiz larger than one KV value is stored in bounded atomic pieces and reconstructed after restart', async () => {
    const h = harness(), large = { ...quiz, items: Array.from({ length: 60 }, (_, i) => ({ ...quiz.items[0], question: { ...quiz.items[0].question, id: `q${i + 1}`, prompt: 'Question '.repeat(300) } })) }
    const created = await h.request('/rooms', 'POST', { quiz: large, settings }, teacherKey)
    assert.equal(created.status, 201)
    const { code, token } = created.body, data = h.stores.get(code).data
    assert.ok(JSON.stringify(h.stores.get(code).value).length > 128 * 1024)
    for (const [key, value] of data) if (key.startsWith('room-') && typeof value === 'string') assert.ok(new TextEncoder().encode(JSON.stringify(value)).length < 128 * 1024)
    h.restart(code)
    const loaded = await h.request(`/rooms/${code}`, 'GET', undefined, token)
    assert.equal(loaded.status, 200); assert.equal(loaded.body.view.total, 60)
  })
  await test('a slow answer upload cannot backdate receipt or earn points after the deadline', async () => {
    const h = await room(), player = (await h.request(`/rooms/${h.code}/join`, 'POST', { avatarId: 'panda' })).body
    await h.request(`/rooms/${h.code}/host`, 'POST', { action: 'start' }, h.host)
    let controller
    const stream = new ReadableStream({ start(value) { controller = value; controller.enqueue(new TextEncoder().encode('{"questionId":"q1",')) } })
    const pending = handleCompetitionRequest(new Request(`https://api.example/competition/rooms/${h.code}/answer`, { method: 'POST', headers: { Origin: origin, Authorization: `Bearer ${player.token}`, 'Content-Type': 'application/json' }, body: stream, duplex: 'half' }), h.env)
    await new Promise(setImmediate)
    now += 11_000
    controller.enqueue(new TextEncoder().encode('"choiceId":"c0"}')); controller.close()
    assert.equal((await pending).status, 409)
    const state = (await h.request(`/rooms/${h.code}`, 'GET', undefined, player.token)).body.view
    assert.equal(state.phase, 'correction'); assert.equal(state.self.points, 0)
  })
  await test('a duplicate host progression from another tab cannot skip correction or the next question', async () => {
    const h = await room()
    await h.request(`/rooms/${h.code}/join`, 'POST', { avatarId: 'panda' })
    await h.request(`/rooms/${h.code}/host`, 'POST', { action: 'start' }, h.host)
    const command = { action: 'next', index: 0, phase: 'question' }
    assert.equal((await h.request(`/rooms/${h.code}/host`, 'POST', command, h.host)).status, 200)
    assert.equal((await h.request(`/rooms/${h.code}/host`, 'POST', command, h.host)).status, 409)
    assert.equal(h.stores.get(h.code).value.room.phase, 'correction')
    assert.equal((await h.request(`/rooms/${h.code}/host`, 'POST', { action: 'next', index: 0, phase: 'correction' }, h.host)).status, 200)
    assert.equal((await h.request(`/rooms/${h.code}/host`, 'POST', { action: 'next', index: 0, phase: 'correction' }, h.host)).status, 409)
    assert.equal(h.stores.get(h.code).value.room.index, 1)
  })
} finally { Date.now = actualNow; await server.close() }
