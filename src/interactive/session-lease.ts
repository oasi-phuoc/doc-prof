export type SessionLease = {
  status: 'owned' | 'busy' | 'unavailable'
  backend: 'locks' | 'channel' | 'none'
  isOwner: () => boolean
  release: () => Promise<void>
}
type Options = { signal: AbortSignal; takeover?: boolean; onYield: () => Promise<void> }
type Message = { type: 'probe' | 'candidate' | 'owned' | 'released' | 'takeover'; token: string }
const validMessage = (value: unknown): value is Message => !!value && typeof value === 'object' && 'type' in value && 'token' in value && typeof value.token === 'string' && value.token.length <= 128 && ['probe', 'candidate', 'owned', 'released', 'takeover'].includes(String(value.type))

/** Only ownership messages cross tabs. No question, key, counts or note is sent. */
export function acquireSessionLease(gameId: string, options: Options): Promise<SessionLease> {
  const name = `clairfle-interactive-session:${gameId}`
  const token = crypto.randomUUID()
  let channel: BroadcastChannel | undefined
  try { if (typeof BroadcastChannel !== 'undefined') channel = new BroadcastChannel(name) } catch { /* Web Locks can still work independently. */ }
  let manager: LockManager | undefined
  try { if (typeof navigator.locks?.request === 'function') manager = navigator.locks } catch { /* Try channel arbitration below. */ }
  let backend: SessionLease['backend'] = manager ? 'locks' : channel ? 'channel' : 'none'
  let owner = false
  let settled = false
  let closed = false
  let yielding = false
  let claimTimer: ReturnType<typeof setTimeout> | undefined
  let heartbeat: ReturnType<typeof setInterval> | undefined
  let finishNative: (() => void) | undefined
  let nativeTask: Promise<unknown> | undefined
  const requestAbort = new AbortController()
  let resolve!: (lease: SessionLease) => void
  const ready = new Promise<SessionLease>((done) => { resolve = done })
  const post = (type: Message['type']) => { try { channel?.postMessage({ type, token } satisfies Message) } catch { /* A closing channel has no data to flush. */ } }
  const close = () => {
    if (closed) return
    closed = true
    clearTimeout(claimTimer)
    clearInterval(heartbeat)
    if (owner) post('released')
    owner = false
    channel?.close()
    options.signal.removeEventListener('abort', abort)
    finishNative?.()
  }
  const release = async () => { close(); await nativeTask }
  const settle = (status: SessionLease['status']) => {
    if (settled) return
    settled = true
    if (status !== 'owned') close()
    resolve({ status, backend, isOwner: () => owner && !closed, release })
  }
  const abort = () => {
    if (owner) return // The UI drains its journal before explicitly releasing.
    requestAbort.abort()
    settle('busy')
  }
  const yieldOwnership = async () => {
    if (!owner || yielding) return
    yielding = true
    try { await options.onYield() } catch { /* The UI reports its own storage failure. */ } finally { await release() }
  }
  const owned = () => {
    if (options.signal.aborted) { settle('busy'); return }
    owner = true
    post('owned')
    heartbeat = setInterval(() => post('owned'), 2000)
    settle('owned')
  }
  let occupied: string | undefined
  const candidates = new Set<string>([token])
  if (channel) channel.onmessage = ({ data }: MessageEvent<unknown>) => {
    if (!validMessage(data) || data.token === token || closed) return
    if (data.type === 'takeover' && owner) { void yieldOwnership(); return }
    if (backend !== 'channel') return
    if (data.type === 'probe') { candidates.add(data.token); post(owner ? 'owned' : 'candidate') }
    if (data.type === 'candidate') candidates.add(data.token)
    if (data.type === 'released' && occupied === data.token) occupied = undefined
    if (data.type === 'owned') {
      if (owner) {
        // Re-arbitrate conflicting ownership after a suspended tab returns.
        void yieldOwnership()
      } else occupied = data.token
    }
  }
  const electByChannel = () => {
    backend = channel ? 'channel' : 'none'
    if (!channel) { settle('unavailable'); return }
    const deadline = Date.now() + (options.takeover ? 2500 : 220)
    post('probe')
    if (options.takeover) post('takeover')
    const decide = () => {
      if (closed || options.signal.aborted) { settle('busy'); return }
      if (occupied && options.takeover && Date.now() < deadline) { claimTimer = setTimeout(decide, 100); return }
      if (occupied || [...candidates].sort()[0] !== token) settle('busy')
      else owned()
    }
    claimTimer = setTimeout(decide, options.takeover ? 400 : 220)
  }
  options.signal.addEventListener('abort', abort, { once: true })
  if (options.signal.aborted) { settle('busy'); return ready }
  if (manager) {
    if (options.takeover) post('takeover')
    nativeTask = manager.request(name, options.takeover ? { mode: 'exclusive', signal: requestAbort.signal } : { mode: 'exclusive', ifAvailable: true }, async (lock) => {
      if (!lock || options.signal.aborted) { settle('busy'); return }
      const held = new Promise<void>((done) => { finishNative = done })
      owned()
      await held
    }).catch(() => { if (!settled && !options.signal.aborted) electByChannel(); else settle('busy') })
  } else electByChannel()
  return ready
}
