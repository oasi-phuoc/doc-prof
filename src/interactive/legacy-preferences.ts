import { MASCOTS } from './domain/mascot'
import { PALETTE, SHAPES, defaultShapes, type ShapeId } from './domain/palette'
import { DEFAULT_TIMER, validSeconds, validFeedbackSeconds, type TimerSettings } from './domain/settings'
import type { ClassroomPreferences } from './preferences'

const COLORS_KEY = 'clairfle.interactive.palette.v2'
const SHAPES_KEY = 'clairfle.interactive.shapes.v1'
export const MODE_KEY = 'clairfle.interactive.mode.v1'
const MASCOT_KEY = 'clairfle.interactive.mascot.v1'
const TIMER_KEY = 'clairfle.interactive.timer.v1'
const GUARD_KEY = 'clairfle.interactive.toolbar-guard.v1'
function readSetting(key: string): unknown {
  try {
    return JSON.parse(localStorage.getItem(key) ?? 'null')
  } catch {
    return null
  }
}
function loadColors(): string[] {
  const value = readSetting(COLORS_KEY)
  return Array.isArray(value) &&
    value.length === 6 &&
    value.every((c) => typeof c === 'string' && /^#[0-9a-f]{6}$/i.test(c))
    ? value
    : PALETTE.map((c) => c.color)
}
function loadShapes(): ShapeId[] {
  const value = readSetting(SHAPES_KEY)
  return Array.isArray(value) &&
    value.length === 6 &&
    new Set(value).size === 6 &&
    value.every((s) => SHAPES.some((shape) => shape.id === s))
    ? value
    : [...defaultShapes]
}
function loadTimer(): TimerSettings {
  const value = readSetting(TIMER_KEY)
  if (
    value &&
    typeof value === 'object' &&
    'enabled' in value &&
    'seconds' in value &&
    typeof value.enabled === 'boolean' &&
    typeof value.seconds === 'number' &&
    Number.isFinite(value.seconds)
  )
    return { enabled: value.enabled, seconds: validSeconds(value.seconds), feedbackSeconds: validFeedbackSeconds('feedbackSeconds' in value && typeof value.feedbackSeconds === 'number' ? value.feedbackSeconds : NaN) }
  return DEFAULT_TIMER
}

export function loadLegacyPreferences(): ClassroomPreferences {
  return { colors: loadColors(), shapes: loadShapes(), timer: loadTimer(), mascot: MASCOTS.find((entry) => entry.id === readSetting(MASCOT_KEY))?.id ?? 'leaf', toolbarGuard: readSetting(GUARD_KEY) === 'hold-to-reveal' ? 'hold-to-reveal' : 'none', contrast: false }
}
