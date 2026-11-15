export type TeacherAccess = { token: string; expiresAt: number }
export const TEACHER_STORAGE_NAME = 'clairfle.competition.teacher.v1'
export const TEACHER_ACCESS_LIFETIME = 30 * 24 * 60 * 60 * 1000
const FORMAT = /^teacher-v1\.(\d{1,16})\.(\d{1,16})\.[a-f0-9]{32}\.[a-f0-9]{64}$/
const DEVICE_CLOCK_TOLERANCE = 5 * 60 * 1000

/** Shape/expiry checks are for local UX; the Worker verifies the signature. */
export function validTeacherAccess(value: unknown, now = Date.now(), issuedAtTolerance = 0): value is TeacherAccess {
  if (!value || typeof value !== 'object' || !('token' in value) || !('expiresAt' in value) || typeof value.token !== 'string' || typeof value.expiresAt !== 'number') return false
  const match = FORMAT.exec(value.token)
  if (!match) return false
  const issuedAt = Number(match[1]), expiresAt = Number(match[2])
  return Number.isSafeInteger(issuedAt) && Number.isSafeInteger(expiresAt) && issuedAt <= now + issuedAtTolerance && issuedAt >= 0 && expiresAt === value.expiresAt && expiresAt > now && expiresAt > issuedAt && expiresAt - issuedAt <= TEACHER_ACCESS_LIFETIME
}

export function readTeacherAccess(apiBase: string): TeacherAccess | null {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(TEACHER_STORAGE_NAME) ?? 'null')
    if (!value || typeof value !== 'object' || !('apiBase' in value) || value.apiBase !== apiBase) return null
    return validTeacherAccess(value, Date.now(), DEVICE_CLOCK_TOLERANCE) ? { token: value.token, expiresAt: value.expiresAt } : null
  } catch { return null }
}

export function saveTeacherAccess(apiBase: string, value: unknown): void {
  if (!validTeacherAccess(value, Date.now(), DEVICE_CLOCK_TOLERANCE)) return
  try { localStorage.setItem(TEACHER_STORAGE_NAME, JSON.stringify({ apiBase, token: value.token, expiresAt: value.expiresAt })) } catch { /* A full/private store never prevents creating the current room. */ }
}

export function forgetTeacherAccess(): void {
  try { localStorage.removeItem(TEACHER_STORAGE_NAME) } catch { /* The form remains available without browser storage. */ }
}
