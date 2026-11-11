import type { PlayMode } from './types'
import type { TimerSettings } from './settings'
import { readPlanOptions, type PlanOptions } from './plan-options'
import { sourcePosition } from './source-position'

export type SourceReference = { kind: 'saved' | 'draft' | 'demo'; id: string }
export type SessionSource = { reference: SourceReference; sourceKey: string; seed: number; selectedKeys: string[]; replay: number; timer: TimerSettings; options?: PlanOptions; presetId?: string; resolvedKeys?: string[] }
const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value)
export function readSessionSource(value: unknown): SessionSource | undefined {
  if (value === undefined) return undefined
  if (!object(value) || !object(value.reference) || !['saved', 'draft', 'demo'].includes(value.reference.kind as string) ||
    typeof value.reference.id !== 'string' || !value.reference.id || value.reference.id.length > 200 || [...value.reference.id].some((char) => char.charCodeAt(0) < 32) ||
    typeof value.sourceKey !== 'string' || !/^(saved|draft|demo)-\d+$/.test(value.sourceKey) ||
    typeof value.seed !== 'number' || !Number.isSafeInteger(value.seed) ||
    !Array.isArray(value.selectedKeys) || value.selectedKeys.length > 5000 || value.selectedKeys.some((key) => typeof key !== 'string' || !sourcePosition.test(key)) ||
    typeof value.replay !== 'number' || !Number.isSafeInteger(value.replay) || value.replay < 0 || value.replay > 5000 ||
    !object(value.timer) || typeof value.timer.enabled !== 'boolean' || typeof value.timer.seconds !== 'number' || !Number.isInteger(value.timer.seconds) || value.timer.seconds < 5 || value.timer.seconds > 600 ||
    typeof value.timer.feedbackSeconds !== 'number' || !Number.isInteger(value.timer.feedbackSeconds) || value.timer.feedbackSeconds < 1 || value.timer.feedbackSeconds > 10) throw new Error('Source de séance invalide. La sauvegarde est conservée.')
  if (value.presetId !== undefined && (typeof value.presetId !== 'string' || value.presetId.length > 100)) throw new Error('Référence de préréglage invalide.')
  if (value.resolvedKeys !== undefined && (!Array.isArray(value.resolvedKeys) || value.resolvedKeys.length > 5000 || new Set(value.resolvedKeys).size !== value.resolvedKeys.length || value.resolvedKeys.some((key) => typeof key !== 'string' || !sourcePosition.test(key) || !(value.selectedKeys as string[]).includes(key)))) throw new Error('Plan de séance invalide. La sauvegarde est conservée.')
  return { reference: { kind: value.reference.kind as SourceReference['kind'], id: value.reference.id }, sourceKey: value.sourceKey, seed: value.seed, selectedKeys: [...value.selectedKeys] as string[], replay: value.replay, timer: { enabled: value.timer.enabled, seconds: value.timer.seconds, feedbackSeconds: value.timer.feedbackSeconds }, ...(value.options !== undefined ? { options: readPlanOptions(value.options) } : {}), ...(value.presetId ? { presetId: value.presetId as string } : {}), ...(value.resolvedKeys ? { resolvedKeys: [...value.resolvedKeys] as string[] } : {}) }
}

export type StoredRun = { source: SessionSource; mode: PlayMode; sessionId: string; gameId: string; updatedAt: number }
