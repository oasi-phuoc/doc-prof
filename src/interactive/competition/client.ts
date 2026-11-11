import type { CompetitionQuiz, CompetitionSettings, RoomView } from './core'
import type { ShapeId } from '../domain/palette'
import type { CompetitionAvatar } from './avatars'

export type RoomCapability = { code: string; token: string; role: 'host' | 'player'; playerId?: string; returnTo?: string }
type RoomReply = { code: string; token: string; playerId?: string; view: RoomView }
function base() {
  const custom = import.meta.env.VITE_COMPETITION_API_URL, fiches = import.meta.env.VITE_FICHES_API_URL
  const value = typeof custom === 'string' && custom.trim() ? custom.trim() : typeof fiches === 'string' && fiches.trim() ? `${fiches.replace(/\/+$/, '')}/competition` : ''
  return value.replace(/\/+$/, '')
}
export const competitionOnlineConfigured = () => !!base()
export async function competitionAvailable(signal: AbortSignal): Promise<boolean> {
  if (!base()) return false
  try { const response = await fetch(`${base()}/status`, { signal, credentials: 'omit', cache: 'no-store' }); const data = await response.json(); return response.ok && data?.available === true } catch { return false }
}
async function request(path: string, token?: string, data?: unknown, signal?: AbortSignal): Promise<RoomReply> {
  if (!base()) throw new Error('Les salles en ligne ne sont pas encore activées sur ce site. Le défi local reste disponible.')
  let response: Response
  try { response = await fetch(`${base()}${path}`, { method: data === undefined ? 'GET' : 'POST', credentials: 'omit', cache: 'no-store', signal,
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(data === undefined ? {} : { 'Content-Type': 'application/json' }) }, ...(data === undefined ? {} : { body: JSON.stringify(data) }) }) }
  catch (error) { if (signal?.aborted) throw error; throw new Error('Connexion interrompue. La salle se reconnecte automatiquement.') }
  const body: unknown = await response.json().catch(() => null)
  if (!response.ok || !body || typeof body !== 'object' || !('view' in body)) throw new Error(body && typeof body === 'object' && 'error' in body && typeof body.error === 'string' ? body.error : 'La salle est momentanément indisponible.')
  return body as RoomReply
}
export const readRoom = (access: RoomCapability, signal?: AbortSignal) => request(`/rooms/${access.code}`, access.token, undefined, signal)
export const roomCommand = (access: RoomCapability, action: string, playerId?: string, expected?: { index: number; phase: string }) => request(`/rooms/${access.code}/host`, access.token, { action, ...(playerId ? { playerId } : {}), ...expected })
export const answerRoom = (access: RoomCapability, questionId: string, choiceId: string) => request(`/rooms/${access.code}/answer`, access.token, { questionId, choiceId })
export const joinRoom = (code: string, avatarId: CompetitionAvatar) => request(`/rooms/${code}/join`, undefined, { avatarId })
export const createRoom = (quiz: CompetitionQuiz, settings: CompetitionSettings, colors: string[], shapes: ShapeId[], teacherKey: string) => request('/rooms', teacherKey, { quiz, settings, colors, shapes })
const capabilityKey = (role: RoomCapability['role'], code: string) => `clairfle.competition.${role}.${code}`
export function saveRoomCapability(value: RoomCapability) { try { sessionStorage.setItem(capabilityKey(value.role, value.code), JSON.stringify(value)) } catch { /* The current page can still use its capability. */ } }
export function readRoomCapability(role: RoomCapability['role'], code: string): RoomCapability | null {
  try { const value = JSON.parse(sessionStorage.getItem(capabilityKey(role, code)) ?? 'null'); return value && value.role === role && value.code === code && /^[0-9a-f]{64}$/.test(value.token) ? value : null } catch { return null }
}
