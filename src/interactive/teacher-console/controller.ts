import { HOLD_TO_REVEAL_MS } from '../domain/teacher'
import type { Action, Game, Session } from '../domain/types'
import { consoleAction, consoleEnvelope, readConsoleRequest, teacherSnapshot, validConsoleEnvelope, type ConsoleMessage, type ConsoleSnapshot, type ConsoleView } from './protocol'

type Context = { game: Game; state: Session; view: ConsoleView }
type Clock = { now: () => number; setTimeout: (callback: () => void, delay: number) => ReturnType<typeof setTimeout>; clearTimeout: (timer: ReturnType<typeof setTimeout>) => void }
/** The projection owns all state. Neither snapshots nor commands read/write storage. */
export class TeacherConsoleController {
  private revision = 0
  private previous?: { state: Session; game: Game; view: string }
  private seen = new Set<string>()
  private hold?: { revision: number; started: number; timer: ReturnType<typeof setTimeout> }
  private disposed = false
  private confirmation?: { action: 'skip' | 'finish' | 'retry'; revision: number }
  private onDialog: (open: boolean) => void
  private session: string
  private context: () => Context
  private dispatch: (action: Action) => void
  private send: (message: ConsoleMessage) => void
  private clock: Clock
  constructor(session: string, context: () => Context, dispatch: (action: Action) => void, send: (message: ConsoleMessage) => void, clock: Clock = { now: () => Date.now(), setTimeout: (callback, delay) => globalThis.setTimeout(callback, delay), clearTimeout: timer => globalThis.clearTimeout(timer) }, onDialog: (open: boolean) => void = () => {}) {
    this.session = session; this.context = context; this.dispatch = dispatch; this.send = send; this.clock = clock
    this.onDialog = onDialog
  }
  snapshot(): ConsoleSnapshot {
    const { game, state, view } = this.context()
    const next = teacherSnapshot(game, state, view, this.session, this.revision, this.clock.now())
    const signature = JSON.stringify([view, next.commands])
    if (state !== this.previous?.state || game !== this.previous?.game || signature !== this.previous?.view) {
      this.revision++
      this.previous = { state, game, view: signature }
      this.cancelHold()
      this.cancelDialog()
    }
    return { ...next, revision: this.revision }
  }
  publish() { if (!this.disposed) this.send(this.snapshot()) }
  private cancelHold() { if (this.hold) this.clock.clearTimeout(this.hold.timer); this.hold = undefined }
  private cancelDialog() { if (this.confirmation) { this.confirmation = undefined; this.onDialog(false) } }
  receive(value: unknown) {
    if (this.disposed || !validConsoleEnvelope(value, this.session)) return
    if (value.type === 'hello') { this.publish(); return }
    if (value.type === 'bye') { this.cancelHold(); this.cancelDialog(); return }
    const request = readConsoleRequest(value, this.session)
    if (!request || this.seen.has(request.id)) return
    this.seen.add(request.id)
    if (this.seen.size > 256) this.seen.delete(this.seen.values().next().value!)
    if (request.command.name === 'reveal-cancel') { this.cancelHold(); return }
    if (request.command.name === 'confirm-cancel') { this.cancelDialog(); return }
    const snapshot = this.snapshot()
    const reject = () => {
      this.send({ ...consoleEnvelope(this.session), type: 'ack', id: request.id, accepted: false, message: 'La séance a changé ou cette commande est indisponible. Vérifiez l’écran de la console.' })
      this.publish()
    }
    if (request.revision !== snapshot.revision || !snapshot.commands.includes(request.command.name)) { reject(); return }
    if (this.confirmation && (request.command.name !== this.confirmation.action || request.revision !== this.confirmation.revision)) { reject(); return }
    if (['skip', 'finish', 'retry'].includes(request.command.name) && !this.confirmation) { reject(); return }
    this.cancelHold()
    if (request.command.name === 'confirm-start') {
      if (!snapshot.commands.includes(request.command.action)) { reject(); return }
      this.confirmation = { action: request.command.action, revision: snapshot.revision }; this.onDialog(true)
    } else if (request.command.name === 'reveal-start') {
      const revision = snapshot.revision, started = this.clock.now()
      const reveal = () => {
        if (this.disposed || this.hold?.revision !== revision) return
        const fresh = this.snapshot()
        if (fresh.revision !== revision || !fresh.commands.includes('reveal-start')) return
        const remaining = HOLD_TO_REVEAL_MS - (this.clock.now() - started)
        if (remaining > 0) { this.hold!.timer = this.clock.setTimeout(reveal, remaining); return }
        this.hold = undefined
        this.dispatch({ type: 'REVEAL', roundId: fresh.roundId }); this.publish()
      }
      this.hold = { revision, started, timer: this.clock.setTimeout(reveal, HOLD_TO_REVEAL_MS) }
    } else {
      const action = consoleAction(request.command, snapshot)
      if (!action) { reject(); return }
      this.cancelDialog()
      this.dispatch(action)
    }
    this.send({ ...consoleEnvelope(this.session), type: 'ack', id: request.id, accepted: true })
    this.publish()
  }
  dispose() {
    if (this.disposed) return
    this.cancelHold()
    this.cancelDialog()
    this.send({ ...consoleEnvelope(this.session), type: 'closed' })
    this.disposed = true
  }
}
