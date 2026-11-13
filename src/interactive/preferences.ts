import { openInteractiveDatabase, LOCAL_STORAGE_WARNING } from './storage'
import { MASCOTS, type MascotKind } from './domain/mascot'
import { SHAPES, type ShapeId } from './domain/palette'
import type { TimerSettings } from './domain/settings'
import type { ToolbarGuard } from './domain/teacher'
import { paletteFingerprint, type PaletteCalibration } from './domain/calibration'

export type ClassroomPreferences = { colors: string[]; shapes: ShapeId[]; timer: TimerSettings; mascot: MascotKind; toolbarGuard: ToolbarGuard; contrast: boolean; showTranscripts?: boolean; paletteVersion?: number; calibration?: PaletteCalibration }
const fields = ['colors', 'shapes', 'timer', 'mascot', 'toolbarGuard', 'contrast', 'showTranscripts', 'calibration']
const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value)
function valid(value: unknown): value is ClassroomPreferences {
  if (!object(value) || !Array.isArray(value.colors) || value.colors.length !== 6 || value.colors.some((color) => typeof color !== 'string' || !/^#[\da-f]{6}$/i.test(color)) ||
    !Array.isArray(value.shapes) || value.shapes.length !== 6 || new Set(value.shapes).size !== 6 || value.shapes.some((shape) => !SHAPES.some((entry) => entry.id === shape)) ||
    !MASCOTS.some((entry) => entry.id === value.mascot) || !['none', 'hold-to-reveal'].includes(value.toolbarGuard as string) || typeof value.contrast !== 'boolean' || !object(value.timer)) return false
  if (value.paletteVersion !== undefined && (typeof value.paletteVersion !== 'number' || !Number.isSafeInteger(value.paletteVersion) || value.paletteVersion < 1)) return false
  if (value.showTranscripts !== undefined && typeof value.showTranscripts !== 'boolean') return false
  if (value.calibration !== undefined && (!object(value.calibration) || typeof value.calibration.paletteVersion !== 'number' || !Number.isSafeInteger(value.calibration.paletteVersion) || value.calibration.paletteVersion < 1 || typeof value.calibration.paletteHash !== 'string' || !/^palette-\d+$/.test(value.calibration.paletteHash) || typeof value.calibration.confirmedAt !== 'number' || !Number.isFinite(value.calibration.confirmedAt) || value.calibration.confirmedAt < 0)) return false
  return typeof value.timer.enabled === 'boolean' && typeof value.timer.seconds === 'number' && Number.isInteger(value.timer.seconds) && value.timer.seconds >= 5 && value.timer.seconds <= 600 &&
    typeof value.timer.feedbackSeconds === 'number' && Number.isInteger(value.timer.feedbackSeconds) && value.timer.feedbackSeconds >= 1 && value.timer.feedbackSeconds <= 10
}

/** Merge in one transaction so two tabs changing distinct preferences do not overwrite each other. */
async function access(fallback: ClassroomPreferences, patch?: Partial<ClassroomPreferences>): Promise<ClassroomPreferences> {
  const db = await openInteractiveDatabase()
  return new Promise((resolve, reject) => {
    let result: ClassroomPreferences
    let failure: Error | undefined
    try {
      const tx = db.transaction('settings', 'readwrite')
      const store = tx.objectStore('settings')
      const request = store.get('classroom')
      request.onsuccess = () => {
        const row: unknown = request.result
        if (row !== undefined && (!object(row) || row.schemaVersion !== 1 || !valid(row.settings))) { failure = new Error('Version ou contenu des réglages non pris en charge. Les données sont conservées.'); tx.abort(); return }
        const previous = row === undefined ? fallback : (row as { settings: ClassroomPreferences }).settings
        if (patch && Object.keys(patch).some((key) => !fields.includes(key))) { failure = new Error('Réglages invalides.'); tx.abort(); return }
        const next = { ...previous, ...patch }
        if (!valid(next)) { failure = new Error('Réglages invalides.'); tx.abort(); return }
        if (patch && paletteFingerprint(next.colors, next.shapes) !== paletteFingerprint(previous.colors, previous.shapes)) next.paletteVersion = (previous.paletteVersion ?? 1) + 1
        if (patch?.calibration && (patch.calibration.paletteVersion !== (next.paletteVersion ?? 1) || patch.calibration.paletteHash !== paletteFingerprint(next.colors, next.shapes))) { failure = new Error('La palette a changé dans un autre onglet. Rechargez-la avant de confirmer la comparaison.'); tx.abort(); return }
        if (!valid(next)) { failure = new Error('Réglages invalides.'); tx.abort(); return }
        result = structuredClone(next)
        if (row === undefined || patch) store.put({ ...(object(row) ? row : {}), id: 'classroom', schemaVersion: 1, settings: result })
      }
      tx.oncomplete = () => resolve(result)
      tx.onerror = tx.onabort = () => reject(failure ?? new Error(LOCAL_STORAGE_WARNING))
    } catch { reject(new Error(LOCAL_STORAGE_WARNING)) }
  })
}
export function readClassroomPreferences(legacy: ClassroomPreferences) { return access(legacy) }
export function patchClassroomPreferences(patch: Partial<ClassroomPreferences>, fallback: ClassroomPreferences) { return access(fallback, patch) }
