import { CompetitionError, competitionStep, competitionView, createCompetition, parseCompetitionQuiz, parseCompetitionSettings, type CompetitionRoom } from '../../../src/interactive/competition/core'
import { validAvatar } from '../../../src/interactive/competition/avatars'
import type { ShapeId } from '../../../src/interactive/domain/palette'

export interface CompetitionStorage {
  get<T>(key: string): Promise<T | undefined>
  put(keyOrEntries: string | Record<string, unknown>, value?: unknown): Promise<void>
  deleteAll(): Promise<void>
  setAlarm(at: number): Promise<void>
}
export interface CompetitionState { storage: CompetitionStorage; blockConcurrencyWhile<T>(work: () => Promise<T>): Promise<T> }
export interface CompetitionNamespace { idFromName(name: string): unknown; get(id: unknown): { fetch(request: Request): Promise<Response> } }
export interface CompetitionEnv { COMPETITION_ROOMS?: CompetitionNamespace; COMPETITION_HOST_KEY?: string; COMPETITION_ORIGINS?: string }
type Stored = { room: CompetitionRoom; hostHash: string; playerHashes: Record<string, string> }
const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value)
const only = (value: Record<string, unknown>, fields: string[]) => Object.keys(value).every((key) => fields.includes(key))
const token = () => [...crypto.getRandomValues(new Uint8Array(32))].map((n) => n.toString(16).padStart(2, '0')).join('')
const bearer = (request: Request) => /^Bearer ([^\s]{1,512})$/.exec(request.headers.get('Authorization') ?? '')?.[1] ?? ''
async function digest(value: string) { return [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))].map((n) => n.toString(16).padStart(2, '0')).join('') }
function equal(a: string, b: string) { if (a.length !== b.length) return false; let difference = 0; for (let i = 0; i < a.length; i++) difference |= a.charCodeAt(i) ^ b.charCodeAt(i); return difference === 0 }
function json(status: number, body: unknown) { return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' } }) }
async function body(request: Request, maximum = 600_000): Promise<Record<string, unknown>> {
  if (!(request.headers.get('Content-Type') ?? '').startsWith('application/json')) throw new CompetitionError('Format de requête invalide.', 415)
  const reader = request.body?.getReader()
  if (!reader) throw new CompetitionError('Requête vide.', 400)
  const chunks: Uint8Array[] = []; let length = 0
  let timeout: ReturnType<typeof setTimeout>
  const deadline = new Promise<never>((_, reject) => { timeout = setTimeout(() => { reject(new CompetitionError('La requête a pris trop de temps. Réessayez.', 408)); void reader.cancel() }, 5000) })
  try { for (;;) { const { value, done } = await Promise.race([reader.read(), deadline]); if (done) break; length += value.length; if (length > maximum) { await reader.cancel(); throw new CompetitionError('Cette série est trop volumineuse pour une salle. Réduisez la sélection.', 413) } chunks.push(value) } }
  finally { clearTimeout(timeout!) }
  const bytes = new Uint8Array(length); let offset = 0
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length }
  let result: unknown
  try { result = JSON.parse(new TextDecoder().decode(bytes)) } catch { throw new CompetitionError('Requête illisible.', 400) }
  if (!object(result)) throw new CompetitionError('Requête invalide.', 400)
  return result
}

/** No query-string credentials, names, arbitrary actions, or permissive origin reflection. */
export async function handleCompetitionRequest(request: Request, env: CompetitionEnv): Promise<Response> {
  const origin = request.headers.get('Origin'), allowed = (env.COMPETITION_ORIGINS ?? '').split(',').map((value) => value.trim()).filter(Boolean)
  if (origin && !allowed.includes(origin)) return json(403, { error: 'Cette origine n’est pas autorisée pour les salles.' })
  const respond = (response: Response) => {
    const headers = new Headers(response.headers)
    if (origin) headers.set('Access-Control-Allow-Origin', origin)
    headers.set('Vary', 'Origin'); headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type'); headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    return new Response(response.body, { status: response.status, headers })
  }
  if (request.method === 'OPTIONS') return respond(new Response(null, { status: 204 }))
  try {
    if (!env.COMPETITION_ROOMS || !env.COMPETITION_HOST_KEY || env.COMPETITION_HOST_KEY.length < 16 || !allowed.length) return respond(json(503, { error: 'Les salles en ligne ne sont pas encore activées sur ce site. Le défi local reste disponible.' }))
    const url = new URL(request.url), parts = url.pathname.replace(/^\/competition\/?/, '').split('/').filter(Boolean)
    if (url.search) throw new CompetitionError('Les identifiants ne doivent pas figurer dans l’adresse.', 400)
    if (parts.length === 1 && parts[0] === 'status' && request.method === 'GET') return respond(json(200, { available: true }))
    if (parts[0] !== 'rooms') return respond(json(404, { error: 'Adresse inconnue.' }))
    const gateKind = request.method === 'POST' && parts.length === 1 ? 'create' : request.method === 'POST' && parts[2] === 'join' ? 'join' : null
    if (gateKind) {
      const ipHash = await digest(request.headers.get('CF-Connecting-IP') ?? 'local-adapter')
      const gate = env.COMPETITION_ROOMS.get(env.COMPETITION_ROOMS.idFromName(`gate:${ipHash}`))
      const permission = await gate.fetch(new Request('https://room/gate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind: gateKind }) }))
      if (!permission.ok) return respond(permission)
    }
    if (parts.length === 1 && request.method === 'POST') {
      const provided = bearer(request)
      if (!provided || !equal(await digest(provided), await digest(env.COMPETITION_HOST_KEY))) throw new CompetitionError('L’accès enseignant aux salles est refusé.', 401)
      const data = await body(request)
      if (!only(data, ['quiz', 'settings', 'colors', 'shapes'])) throw new CompetitionError('Champs de salle invalides.', 400)
      // Only this authenticated path can initialize a room object.
      for (let attempt = 0; attempt < 8; attempt++) {
        const bytes = crypto.getRandomValues(new Uint32Array(1)), code = String(100_000 + bytes[0]! % 900_000)
        const stub = env.COMPETITION_ROOMS.get(env.COMPETITION_ROOMS.idFromName(code))
        const response = await stub.fetch(new Request(`https://room/create/${code}`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Room-Origin': origin ?? allowed[0]! }, body: JSON.stringify(data) }))
        if (response.status !== 409) return respond(response)
      }
      throw new CompetitionError('Impossible de créer une salle pour le moment. Réessayez.', 503)
    }
    if (!/^\d{6}$/.test(parts[1] ?? '') || parts.length > 3 || !['', 'join', 'answer', 'host'].includes(parts[2] ?? '') || !['GET', 'POST'].includes(request.method)) return respond(json(404, { error: 'Adresse inconnue.' }))
    // Complete bounded uploads before entering the serialized room, so a slow
    // sender cannot block its alarm or backdate an answer to its first byte.
    const data = request.method === 'POST' ? await body(request, 4096) : undefined
    const target = new URL(`https://room/${parts[2] ?? 'view'}`)
    return respond(await env.COMPETITION_ROOMS.get(env.COMPETITION_ROOMS.idFromName(parts[1]!)).fetch(new Request(target, { method: request.method, headers: request.headers, ...(data ? { body: JSON.stringify(data) } : {}) })))
  } catch (error) { return respond(json(error instanceof CompetitionError ? error.status : 500, { error: error instanceof CompetitionError ? error.message : 'La salle est momentanément indisponible.' })) }
}

/** Serialized mutations and durable alarms keep one authoritative clock and score. */
export class ClassroomCompetitionRoom {
  private storage: CompetitionStorage
  private stored?: Stored
  private ready: Promise<void>
  private queue: Promise<unknown> = Promise.resolve()
  private joins = new Map<string, { at: number; count: number }>()
  private gate?: { at: number; create: number; join: number }
  constructor(state: CompetitionState) {
    this.storage = state.storage
    this.ready = state.blockConcurrencyWhile(async () => {
      this.gate = await this.storage.get('rate')
      const meta = await this.storage.get<{ version: number; parts: number }>('room-parts')
      if (meta) {
        if (meta.version !== 1 || !Number.isInteger(meta.parts) || meta.parts < 1 || meta.parts > 120) throw new Error('Unsupported room storage.')
        const parts = await Promise.all(Array.from({ length: meta.parts }, (_, i) => this.storage.get<string>(`room-${i}`)))
        if (parts.some((part) => typeof part !== 'string')) throw new Error('Incomplete room storage.')
        this.stored = JSON.parse(parts.join('')) as Stored
        if (this.stored.room.version !== 1) throw new Error('Unsupported room version.')
      }
    })
  }
  fetch(request: Request): Promise<Response> {
    const response = this.queue.then(async () => { await this.ready; return this.handle(request) })
    this.queue = response.then(() => undefined, () => undefined)
    return response
  }
  async alarm() {
    const task = this.queue.then(async () => {
      await this.ready
      if (this.gate) { this.gate = undefined; await this.storage.deleteAll(); return }
      if (!this.stored) return
      const now = Date.now()
      if (now >= this.stored.room.expiresAt) { this.stored = undefined; await this.storage.deleteAll(); return }
      this.stored.room = competitionStep(this.stored.room, { type: 'tick' }, now)
      await this.save()
    })
    this.queue = task.then(() => undefined, () => undefined)
    await task
  }
  private async save() {
    if (!this.stored) return
    // A Durable Object KV value is limited to 128 KiB. One atomic multi-put
    // persists the complete snapshot in small strings, including large quizzes.
    const serialized = JSON.stringify(this.stored), parts = Math.ceil(serialized.length / 16_000)
    if (parts > 120) throw new CompetitionError('Cette série dépasse la capacité de la salle.', 413)
    const entries: Record<string, unknown> = { 'room-parts': { version: 1, parts } }
    for (let i = 0; i < parts; i++) entries[`room-${i}`] = serialized.slice(i * 16_000, (i + 1) * 16_000)
    await this.storage.put(entries)
    await this.storage.setAlarm(Math.min(this.stored.room.expiresAt, this.stored.room.deadline ?? Infinity))
  }
  private async handle(request: Request): Promise<Response> {
    try {
      const requestData = request.method === 'POST' ? await body(request) : undefined
      const url = new URL(request.url), now = Date.now()
      if (url.pathname === '/gate' && request.method === 'POST') {
        const data = requestData!
        if (data.kind !== 'create' && data.kind !== 'join') throw new CompetitionError('Requête invalide.', 400)
        if (!this.gate || now - this.gate.at >= 60_000) this.gate = { at: now, create: 0, join: 0 }
        if (++this.gate[data.kind] > (data.kind === 'create' ? 10 : 180)) throw new CompetitionError('Trop de tentatives. Réessayez dans une minute.', 429)
        await this.storage.put('rate', this.gate); await this.storage.setAlarm(this.gate.at + 60_000)
        return json(200, { allowed: true })
      }
      if (url.pathname.startsWith('/create/') && request.method === 'POST') {
        if (this.stored && now < this.stored.room.expiresAt) throw new CompetitionError('Code déjà occupé.')
        const data = requestData!, origin = request.headers.get('X-Room-Origin')
        if (!origin) throw new CompetitionError('Origine manquante.', 400)
        const quiz = parseCompetitionQuiz(data.quiz, [origin]), settings = parseCompetitionSettings(data.settings)
        const hostToken = token(), room = createCompetition(quiz, settings, 'online', url.pathname.split('/')[2]!, now, data.colors as string[] | undefined, data.shapes as ShapeId[] | undefined)
        this.stored = { room, hostHash: await digest(hostToken), playerHashes: {} }; await this.save()
        return json(201, { code: room.code, token: hostToken, view: competitionView(room, now) })
      }
      if (!this.stored || now >= this.stored.room.expiresAt) { if (this.stored) { this.stored = undefined; await this.storage.deleteAll() } throw new CompetitionError('Cette salle n’existe plus. Vérifiez le code.', 404) }
      const ticked = competitionStep(this.stored.room, { type: 'tick' }, now)
      if (ticked !== this.stored.room) { this.stored.room = ticked; await this.save() }
      if (url.pathname === '/join' && request.method === 'POST') {
        const ip = request.headers.get('CF-Connecting-IP') ?? 'anonymous', previous = this.joins.get(ip)
        const bucket = previous && now - previous.at < 60_000 ? previous : { at: now, count: 0 }
        if (++bucket.count > 120) throw new CompetitionError('Trop de tentatives. Réessayez dans une minute.', 429)
        if (this.joins.size > 1000) this.joins.clear()
        this.joins.set(ip, bucket)
        const data = requestData!
        if (!only(data, ['avatarId']) || !validAvatar(data.avatarId)) throw new CompetitionError('Choisissez une mascotte proposée. Aucun nom n’est demandé.', 400)
        this.stored.room = competitionStep(this.stored.room, { type: 'join', avatarId: data.avatarId }, now)
        const player = this.stored.room.players.at(-1)!, playerToken = token()
        this.stored.playerHashes[player.id] = await digest(playerToken); await this.save()
        return json(201, { code: this.stored.room.code, token: playerToken, playerId: player.id, view: competitionView(this.stored.room, now, player.id) })
      }
      const provided = bearer(request)
      if (!/^[0-9a-f]{64}$/.test(provided)) throw new CompetitionError('Rejoignez la salle pour continuer.', 401)
      const hashed = await digest(provided), host = equal(hashed, this.stored.hostHash)
      const playerId = host ? undefined : Object.keys(this.stored.playerHashes).find((id) => equal(hashed, this.stored!.playerHashes[id]!))
      if (!host && !playerId) throw new CompetitionError('Cet accès à la salle n’est plus valide.', 401)
      if (url.pathname === '/view' && request.method === 'GET') return json(200, { view: competitionView(this.stored.room, now, playerId) })
      if (url.pathname === '/answer' && request.method === 'POST' && playerId) {
        const data = requestData!
        if (!only(data, ['questionId', 'choiceId']) || typeof data.questionId !== 'string' || typeof data.choiceId !== 'string') throw new CompetitionError('Réponse invalide.', 400)
        this.stored.room = competitionStep(this.stored.room, { type: 'answer', playerId, questionId: data.questionId, choiceId: data.choiceId }, now)
      } else if (url.pathname === '/host' && request.method === 'POST' && host) {
        const data = requestData!
        if (!only(data, ['action', 'playerId', 'index', 'phase']) || typeof data.action !== 'string') throw new CompetitionError('Commande invalide.', 400)
        if (data.action === 'next' && (data.index !== this.stored.room.index || data.phase !== this.stored.room.phase)) throw new CompetitionError('La question a déjà changé. L’affichage se met à jour.')
        if (data.action === 'remove' && typeof data.playerId === 'string') { this.stored.room = competitionStep(this.stored.room, { type: 'remove', playerId: data.playerId }, now); delete this.stored.playerHashes[data.playerId] }
        else if (['start', 'next', 'pause', 'resume', 'finish'].includes(data.action) && data.playerId === undefined) this.stored.room = competitionStep(this.stored.room, { type: data.action as 'start' | 'next' | 'pause' | 'resume' | 'finish' }, now)
        else throw new CompetitionError('Commande invalide.', 400)
      } else throw new CompetitionError('Cette commande est réservée à l’enseignant.', 403)
      await this.save()
      return json(200, { view: competitionView(this.stored.room, now, playerId) })
    } catch (error) { return json(error instanceof CompetitionError ? error.status : 500, { error: error instanceof CompetitionError ? error.message : 'La salle est momentanément indisponible.' }) }
  }
}
