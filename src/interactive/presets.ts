import { openInteractiveDatabase, requestLocal, LOCAL_STORAGE_WARNING } from './storage'
import { CONVERSION_VERSION } from './domain/seeds'
import { readPlanOptions, type PlanOptions } from './domain/plan-options'
import { sourcePosition } from './domain/source-position'
import type { PlayMode } from './domain/types'
import type { TimerSettings } from './domain/settings'

export type LocalPreset = {
  version: 2; presetId: string; sourceKey: string; name: string
  conversionVersion: number; paletteVersion: number; contentHashAtSave: string
  selectedQuestionIds: string[]; orderMode: PlanOptions['orderMode']; customOrder: string[]; maxChoices: PlanOptions['maxChoices']; numericOrder: boolean
  revealPolicy: 'teacher-only'; correctionTiming: 'deferred' | 'immediate'; voteBeforeBoard: boolean
  timer: { enabled: boolean; defaultSec: number; feedbackSec: number }
  scoring: { mode: 'none' }; effects: { badges: false }; playMode: PlayMode
  revision: number; createdAt: number; updatedAt: number
}
export type PresetInput = { sourceKey: string; name: string; contentHashAtSave: string; selectedQuestionIds: string[]; options: PlanOptions; timer: TimerSettings; playMode: PlayMode; paletteVersion?: number }
const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value)
export const presetOptions = (preset: LocalPreset): PlanOptions => readPlanOptions({ orderMode: preset.orderMode, customOrder: preset.customOrder, maxChoices: preset.maxChoices, numericOrder: preset.numericOrder })
export function readLocalPreset(raw: unknown): LocalPreset {
  if (!object(raw) || Object.keys(raw).some((key) => !['version', 'presetId', 'sourceKey', 'name', 'conversionVersion', 'paletteVersion', 'contentHashAtSave', 'selectedQuestionIds', 'orderMode', 'customOrder', 'maxChoices', 'numericOrder', 'revealPolicy', 'correctionTiming', 'voteBeforeBoard', 'timer', 'scoring', 'effects', 'playMode', 'revision', 'createdAt', 'updatedAt'].includes(key)) || raw.version !== 2 || typeof raw.presetId !== 'string' || !raw.presetId || raw.presetId.length > 100 || typeof raw.sourceKey !== 'string' || !raw.sourceKey || raw.sourceKey.length > 300 ||
    typeof raw.name !== 'string' || !raw.name.trim() || raw.name.length > 80 || typeof raw.contentHashAtSave !== 'string' || !raw.contentHashAtSave ||
    typeof raw.conversionVersion !== 'number' || !Number.isInteger(raw.conversionVersion) || raw.conversionVersion < 1 || typeof raw.paletteVersion !== 'number' || !Number.isSafeInteger(raw.paletteVersion) || raw.paletteVersion < 1 ||
    !Array.isArray(raw.selectedQuestionIds) || raw.selectedQuestionIds.length > 5000 || new Set(raw.selectedQuestionIds).size !== raw.selectedQuestionIds.length || raw.selectedQuestionIds.some((id) => typeof id !== 'string' || !sourcePosition.test(id)) ||
    !['class', 'solo'].includes(raw.playMode as string) || raw.revealPolicy !== 'teacher-only' || !['deferred', 'immediate'].includes(raw.correctionTiming as string) || typeof raw.voteBeforeBoard !== 'boolean' ||
    !object(raw.timer) || typeof raw.timer.enabled !== 'boolean' || typeof raw.timer.defaultSec !== 'number' || !Number.isInteger(raw.timer.defaultSec) || raw.timer.defaultSec < 5 || raw.timer.defaultSec > 600 ||
    typeof raw.timer.feedbackSec !== 'number' || !Number.isInteger(raw.timer.feedbackSec) || raw.timer.feedbackSec < 1 || raw.timer.feedbackSec > 10 ||
    !object(raw.scoring) || raw.scoring.mode !== 'none' || !object(raw.effects) || raw.effects.badges !== false ||
    typeof raw.revision !== 'number' || !Number.isSafeInteger(raw.revision) || raw.revision < 0 ||
    typeof raw.createdAt !== 'number' || !Number.isFinite(raw.createdAt) || typeof raw.updatedAt !== 'number' || !Number.isFinite(raw.updatedAt)) throw new Error('Préréglage invalide ou créé par une version plus récente. Ses données sont conservées.')
  const options = readPlanOptions({ orderMode: raw.orderMode, customOrder: raw.customOrder, maxChoices: raw.maxChoices, numericOrder: raw.numericOrder })
  return { version: 2, presetId: raw.presetId, sourceKey: raw.sourceKey, name: raw.name.trim(), conversionVersion: raw.conversionVersion, paletteVersion: raw.paletteVersion, contentHashAtSave: raw.contentHashAtSave, selectedQuestionIds: [...raw.selectedQuestionIds] as string[], ...options,
    revealPolicy: 'teacher-only', correctionTiming: raw.correctionTiming as LocalPreset['correctionTiming'], voteBeforeBoard: raw.voteBeforeBoard, timer: { enabled: raw.timer.enabled, defaultSec: raw.timer.defaultSec, feedbackSec: raw.timer.feedbackSec },
    scoring: { mode: 'none' }, effects: { badges: false }, playMode: raw.playMode as PlayMode, revision: raw.revision, createdAt: raw.createdAt, updatedAt: raw.updatedAt }
}
export async function listLocalPresets(sourceKey: string): Promise<{ presets: LocalPreset[]; unavailable: number }> {
  const rows = await requestLocal('presets-local', 'readonly', (store) => store.index('sourceKey').getAll(sourceKey))
  const presets: LocalPreset[] = []; let unavailable = 0
  for (const raw of rows) { try { presets.push(readLocalPreset(raw)) } catch { unavailable++ } }
  return { presets: presets.sort((a, b) => b.updatedAt - a.updatedAt || a.name.localeCompare(b.name, 'fr')), unavailable }
}
async function mutate<T>(presetId: string, change: (value: unknown, store: IDBObjectStore) => T): Promise<T> {
  const db = await openInteractiveDatabase()
  return new Promise((resolve, reject) => {
    let result: T; let failure: unknown
    try {
      const tx = db.transaction('presets-local', 'readwrite')
      const store = tx.objectStore('presets-local'); const request = store.get(presetId)
      request.onsuccess = () => { try { result = change(request.result, store) } catch (error) { failure = error; tx.abort() } }
      tx.oncomplete = () => resolve(result)
      tx.onerror = tx.onabort = () => reject(failure ?? new Error(LOCAL_STORAGE_WARNING))
    } catch { reject(new Error(LOCAL_STORAGE_WARNING)) }
  })
}
const conflict = 'Ce préréglage a changé dans un autre onglet. Rechargez la liste avant de le modifier.'
export async function saveLocalPreset(input: PresetInput, previous?: LocalPreset): Promise<LocalPreset> {
  const now = Date.now()
  const next = readLocalPreset({ version: 2, presetId: previous?.presetId ?? crypto.randomUUID(), sourceKey: input.sourceKey, name: input.name.trim(), conversionVersion: CONVERSION_VERSION, paletteVersion: input.paletteVersion ?? previous?.paletteVersion ?? 1, contentHashAtSave: input.contentHashAtSave,
    selectedQuestionIds: input.selectedQuestionIds, ...input.options, revealPolicy: 'teacher-only', correctionTiming: input.playMode === 'solo' ? 'immediate' : 'deferred', voteBeforeBoard: input.playMode === 'class', timer: { enabled: input.timer.enabled, defaultSec: input.timer.seconds, feedbackSec: input.timer.feedbackSeconds },
    scoring: { mode: 'none' }, effects: { badges: false }, playMode: input.playMode, revision: previous ? previous.revision + 1 : 0, createdAt: previous?.createdAt ?? now, updatedAt: now })
  return mutate(next.presetId, (raw, store) => {
    if (previous) { const existing = readLocalPreset(raw); if (existing.revision !== previous.revision || existing.sourceKey !== previous.sourceKey || existing.sourceKey !== input.sourceKey) throw new Error(conflict) }
    else if (raw !== undefined) throw new Error(conflict)
    store.put(next); return next
  })
}
export async function deleteLocalPreset(previous: LocalPreset): Promise<void> {
  await mutate(previous.presetId, (raw, store) => { const existing = readLocalPreset(raw); if (existing.revision !== previous.revision || existing.sourceKey !== previous.sourceKey) throw new Error(conflict); store.delete(previous.presetId) })
}
