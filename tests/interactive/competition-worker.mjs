import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { spawn } from 'node:child_process'
import { mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
const root = process.cwd(), api = path.join(root, 'api/fiches'), requireApi = createRequire(path.join(api, 'package.json'))
const { Miniflare, convertV4MiniflareOptions, Log, LogLevel } = requireApi('miniflare')
const temporary = await mkdtemp(path.join(tmpdir(), 'clairfle-real-worker-'))
let runtime
try {
  const compiled = path.join(temporary, 'compiled')
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(api, 'node_modules/wrangler/bin/wrangler.js'), 'deploy', '--dry-run', '--outdir', compiled], { cwd: api, env: { ...process.env, XDG_CONFIG_HOME: path.join(temporary, 'config'), WRANGLER_SEND_METRICS: 'false' }, stdio: ['ignore', 'pipe', 'pipe'] })
    const chunks = []; child.stdout.on('data', (chunk) => chunks.push(chunk)); child.stderr.on('data', (chunk) => chunks.push(chunk))
    child.on('error', reject); child.on('exit', async (code) => { if (code === 0) resolve(); else { await writeFile('/tmp/clairfle-worker-build-failure.log', Buffer.concat(chunks)); reject(new Error('Compilation locale du Worker impossible.')) } })
  })
  const origin = 'https://class.example', teacherKey = `fixture-only-${crypto.randomUUID()}`
  const options = { rootPath: compiled, modules: true, scriptPath: path.join(compiled, 'index.js'), compatibilityDate: '2026-04-01', durableObjects: { COMPETITION_ROOMS: { className: 'ClassroomCompetitionRoom', useSQLite: true } }, resourcePersistencePath: path.join(temporary, 'durable'), resourceTmpPath: path.join(temporary, 'runtime-tmp'), cf: false, telemetry: { enabled: false }, d1Databases: ['DB'], bindings: { COMPETITION_HOST_KEY: teacherKey, COMPETITION_ORIGINS: origin }, log: new Log(LogLevel.ERROR) }
  runtime = new Miniflare(convertV4MiniflareOptions(options))
  const request = async (endpoint, data, token) => {
    const response = await runtime.dispatchFetch(`http://worker/competition${endpoint}`, { method: data === undefined ? 'GET' : 'POST', headers: { Origin: origin, ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(data === undefined ? {} : { 'Content-Type': 'application/json' }) }, ...(data === undefined ? {} : { body: JSON.stringify(data) }) })
    return { status: response.status, body: await response.json() }
  }
  assert.equal((await request('/status')).body.available, true)
  const quiz = { id: 'real-runtime', title: 'Durable quiz', items: Array.from({ length: 60 }, (_, i) => ({ question: { id: `source-${i}`, prompt: 'Question '.repeat(300), images: [], choices: [{ id: 'original-yes', text: 'Oui' }, { id: 'original-no', text: 'Non' }] }, correctChoiceId: 'original-yes' })) }
  assert.ok(JSON.stringify(quiz).length > 128 * 1024)
  const settings = { enabled: false, seconds: 30, feedbackSeconds: 10, speedPoints: true }
  const created = await request('/rooms', { quiz, settings }, teacherKey)
  assert.equal(created.status, 201, created.body.error)
  const { code, token: host } = created.body
  const first = (await request(`/rooms/${code}/join`, { avatarId: 'panda' })).body
  const second = (await request(`/rooms/${code}/join`, { avatarId: 'tiger' })).body
  assert.equal((await request(`/rooms/${code}/host`, { action: 'start' }, first.token)).status, 403)
  await request(`/rooms/${code}/host`, { action: 'start' }, host)
  const before = await request(`/rooms/${code}`, undefined, first.token)
  assert.equal(before.body.view.correctChoiceId, undefined); assert.equal(before.body.view.total, 60)
  assert.equal(before.body.view.question.id, 'q1'); assert.ok(!JSON.stringify(before.body.view).includes('original-yes'))
  await request(`/rooms/${code}/answer`, { questionId: 'q1', choiceId: 'c0' }, first.token)
  const corrected = await request(`/rooms/${code}/answer`, { questionId: 'q1', choiceId: 'c1' }, second.token)
  assert.equal(corrected.status, 200); assert.equal(corrected.body.view.phase, 'correction')
  assert.deepEqual(corrected.body.view.players.map((player) => player.score), [1000, 0])
  await request(`/rooms/${code}/host`, { action: 'pause' }, host)
  await runtime.dispose(); runtime = new Miniflare(convertV4MiniflareOptions(options))
  const restored = await request(`/rooms/${code}`, undefined, first.token)
  assert.equal(restored.status, 200); assert.equal(restored.body.view.paused, true)
  assert.equal(restored.body.view.correctChoiceId, 'c0'); assert.deepEqual(restored.body.view.players.map((player) => player.score), [1000, 0])
  const report = { runtime: 'real workerd through Miniflare, SQLite-backed Durable Objects', workerBytes: (await stat(path.join(compiled, 'index.js'))).size,
    quiz: '60 questions, serialized content larger than 128 KiB; bounded atomic KV chunks accepted by the real runtime', authority: 'teacher key and room capabilities; learner cannot control host; original source IDs and future keys absent from learner view', grading: '1000 and 0 points derived by server', restart: 'new workerd instance restores quiz, capabilities, pause, answer key and scores from durable storage', productionDeployment: false }
  await writeFile('docs/interactive/competition-worker-results.json', JSON.stringify(report, null, 2) + '\n')
  console.log(JSON.stringify(report, null, 2))
} finally { await runtime?.dispose(); await rm(temporary, { recursive: true, force: true }) }
