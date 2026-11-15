import { TEACHER_ACCESS_LIFETIME, validTeacherAccess, type TeacherAccess } from '../../../src/interactive/competition/teacher-access'

const hex = (bytes: ArrayBuffer) => [...new Uint8Array(bytes)].map(n => n.toString(16).padStart(2, '0')).join('')
const encoder = new TextEncoder()
const keyFor = (secret: string) => crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify'])
const signedText = (payload: string, origin: string) => encoder.encode(`clairfle:create-competition-room\n${origin}\n${payload}`)

/** Authorizes room creation only, bound to the permitted site and root-key rotation. */
export async function issueTeacherAccess(secret: string, origin: string, now = Date.now()): Promise<TeacherAccess> {
  const expiresAt = now + TEACHER_ACCESS_LIFETIME, nonce = hex(crypto.getRandomValues(new Uint8Array(16)).buffer)
  const payload = `teacher-v1.${now}.${expiresAt}.${nonce}`
  const signature = hex(await crypto.subtle.sign('HMAC', await keyFor(secret), signedText(payload, origin)))
  return { token: `${payload}.${signature}`, expiresAt }
}

export async function verifyTeacherAccess(token: string, secret: string, origin: string, now = Date.now()): Promise<TeacherAccess | null> {
  const value = { token, expiresAt: Number(token.split('.')[2]) }
  if (!validTeacherAccess(value, now)) return null
  const split = token.lastIndexOf('.'), signature = Uint8Array.from(token.slice(split + 1).match(/../g)!, byte => parseInt(byte, 16))
  return await crypto.subtle.verify('HMAC', await keyFor(secret), signature, signedText(token.slice(0, split), origin)) ? value : null
}
