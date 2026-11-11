import { COMPETITION_ART } from './artwork'
import { CompetitionError, competitionStep, createCompetition, parseCompetitionSettings, type CompetitionAction, type CompetitionQuiz, type CompetitionSettings } from './core'
import type { ShapeId } from '../domain/palette'
import { validAvatar } from './avatars'
import { localCompetitionKey as key } from './storage-key'

export type LocalCompetitionJournal = { version: 1; quizId: string; createdAt: number; settings: CompetitionSettings; colors: string[]; shapes: ShapeId[]; events: { at: number; action: CompetitionAction }[] }
function validAction(value: unknown): value is CompetitionAction {
  if (!value || typeof value !== 'object' || !('type' in value)) return false
  const a = value as Record<string, unknown>, fields = Object.keys(a)
  if (a.type === 'join') return fields.every((key) => ['type', 'avatarId'].includes(key)) && validAvatar(a.avatarId)
  if (a.type === 'remove') return fields.every((key) => ['type', 'playerId'].includes(key)) && typeof a.playerId === 'string'
  if (a.type === 'answer') return fields.every((key) => ['type', 'playerId', 'questionId', 'choiceId'].includes(key)) && typeof a.playerId === 'string' && typeof a.questionId === 'string' && (a.choiceId === undefined || typeof a.choiceId === 'string')
  return fields.length === 1 && ['start', 'begin-turn', 'tick', 'pause', 'resume', 'next', 'finish'].includes(a.type as string)
}
export function newLocalCompetition(quiz: CompetitionQuiz, settings: CompetitionSettings, colors: string[], shapes: ShapeId[], now = Date.now()) {
  const journal: LocalCompetitionJournal = { version: 1, quizId: quiz.id, createdAt: now, settings: { ...settings }, colors: [...colors], shapes: [...shapes], events: [] }
  return { room: createCompetition(quiz, settings, 'local', '', now, colors, shapes), journal, warning: '', writable: true }
}
export function readLocalCompetition(quiz: CompetitionQuiz, settings: CompetitionSettings, colors: string[], shapes: ShapeId[], now = Date.now()) {
  const fallback = newLocalCompetition(quiz, settings, colors, shapes, now)
  try {
    const raw = sessionStorage.getItem(key(quiz.id))
    if (!raw) return fallback
    if (raw.length > 1_000_000) throw new Error('Journal trop volumineux.')
    const value = JSON.parse(raw) as LocalCompetitionJournal
    if (!value || value.version !== 1 || value.quizId !== quiz.id || !Number.isFinite(value.createdAt) || value.createdAt > now + 60_000 || !Array.isArray(value.events) || value.events.length > 5000) throw new Error('Journal invalide.')
    let room = createCompetition(quiz, parseCompetitionSettings(value.settings), 'local', '', value.createdAt, value.colors, value.shapes), at = value.createdAt
    if (now >= room.expiresAt) throw new Error('Défi expiré.')
    for (const event of value.events) { if (!Number.isFinite(event.at) || event.at < at || event.at > now + 60_000 || !validAction(event.action)) throw new Error('Action invalide.'); at = event.at; room = competitionStep(room, event.action, at) }
    return { room, journal: value, warning: '', writable: true }
  } catch { return { ...fallback, warning: 'Le défi précédent ne peut pas être repris. Sa sauvegarde est conservée ; vous pouvez recommencer explicitement.', writable: false } }
}
export function writeLocalCompetition(journal: LocalCompetitionJournal) { try { sessionStorage.setItem(key(journal.quizId), JSON.stringify(journal)); return true } catch { return false } }

/** Full blobs, including the avatar sheet, stay available after network loss. */
export async function prepareLocalCompetition(quiz: CompetitionQuiz, signal: AbortSignal): Promise<{ quiz: CompetitionQuiz; artwork: string; dispose: () => void }> {
  const sources = new Set([new URL(COMPETITION_ART, location.origin).href, ...quiz.items.flatMap(({ question: q }) => [...q.images, ...(q.audio ? [q.audio] : []), ...q.choices.flatMap((choice) => choice.image ? [choice.image] : [])])].filter((source) => !source.startsWith('data:') && !source.startsWith('blob:')))
  const urls = new Map<string, string>(); let total = 0
  const dispose = () => { for (const value of urls.values()) URL.revokeObjectURL(value) }
  try {
    for (const source of sources) {
      if (signal.aborted) throw new DOMException('Annulé', 'AbortError')
      const response = await fetch(source, { signal, credentials: 'omit', cache: 'force-cache' })
      if (!response.ok || !/^(?:image|audio)\//i.test(response.headers.get('Content-Type') ?? '') || Number(response.headers.get('Content-Length')) > 32 * 1024 * 1024) throw new CompetitionError('Un média ne peut pas être préparé hors connexion. Vérifiez les images et les audios de la fiche.')
      const blob = await response.blob(); total += blob.size
      if (blob.size > 32 * 1024 * 1024 || total > 128 * 1024 * 1024) throw new CompetitionError('Cette sélection contient trop de médias pour le défi local. Réduisez le nombre de questions.')
      urls.set(source, URL.createObjectURL(blob))
    }
    const copy = structuredClone(quiz), media = (source: string) => urls.get(source) ?? source
    for (const item of copy.items) { const q = item.question; q.images = q.images.map(media); if (q.audio) q.audio = media(q.audio); q.choices = q.choices.map((choice) => ({ ...choice, ...(choice.image ? { image: media(choice.image) } : {}) })) }
    return { quiz: copy, artwork: media(new URL(COMPETITION_ART, location.origin).href), dispose }
  } catch (error) { dispose(); throw error }
}
