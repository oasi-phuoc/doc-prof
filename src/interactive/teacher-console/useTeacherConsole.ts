import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { ShapeId } from '../domain/palette'
import type { ToolbarGuard } from '../domain/teacher'
import type { Action, Game, Session } from '../domain/types'
import { TeacherConsoleController } from './controller'
import { CONSOLE_HEARTBEAT_MS, consoleChannel } from './protocol'
import { usePreparedMedia } from '../media/prepared-context'

export type TeacherConsoleBridge = { open: () => void; setBlocked: (blocked: boolean) => void }
type Options = { game: Game; state: Session; getState: () => Session; dispatch: (action: Action) => void; ownership: () => boolean; guard: ToolbarGuard; colors: string[]; shapes: ShapeId[] }
export function useTeacherConsole(options: Options) {
  const resolveMedia = usePreparedMedia()
  const [session] = useState(() => crypto.randomUUID())
  const [error, setError] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const latest = useRef({ ...options, resolveMedia }), blocked = useRef(true)
  const controller = useRef<TeacherConsoleController | undefined>(undefined)
  const channel = useRef<BroadcastChannel | undefined>(undefined)
  const popup = useRef<Window | undefined>(undefined)
  useLayoutEffect(() => { latest.current = { ...options, resolveMedia } })
  const disconnect = useCallback(() => {
    controller.current?.dispose(); controller.current = undefined
    channel.current?.close(); channel.current = undefined
    popup.current = undefined
  }, [])
  useEffect(() => {
    window.addEventListener('pagehide', disconnect)
    const heartbeat = setInterval(() => {
      if (popup.current?.closed) disconnect()
      else controller.current?.publish()
    }, CONSOLE_HEARTBEAT_MS)
    return () => { clearInterval(heartbeat); window.removeEventListener('pagehide', disconnect); disconnect() }
  }, [disconnect])
  useEffect(() => { controller.current?.publish() }, [options.state, options.colors, options.shapes, options.guard])
  const open = useCallback(() => {
    if (latest.current.getState().mode !== 'class' || !latest.current.ownership()) return
    setError('')
    if (!('BroadcastChannel' in window)) {
      setError('La console est indisponible dans ce navigateur. Utilisez la feuille enseignant depuis la préparation.'); return
    }
    if (popup.current && !popup.current.closed && controller.current) {
      popup.current.focus(); controller.current.publish(); return
    }
    disconnect()
    const address = { session, token: crypto.randomUUID() }
    try {
      const messages = new BroadcastChannel(consoleChannel(address))
      channel.current = messages
      const host = new TeacherConsoleController(session, () => {
        const value = latest.current
        return { game: value.game, state: value.getState(), view: { available: value.ownership(), blocked: blocked.current, guard: value.guard, colors: value.colors, shapes: value.shapes } }
      }, action => latest.current.dispatch(action), message => messages.postMessage(message.type === 'snapshot' ? { ...message, questions: message.questions.map(question => question.answer?.image ? { ...question, answer: { ...question.answer, image: latest.current.resolveMedia(question.answer.image) } } : question) } : message), undefined, setDialogOpen)
      controller.current = host
      messages.onmessage = event => host.receive(event.data)
      const url = new URL('/interactif/console', window.location.origin)
      url.hash = `${address.session}/${address.token}`
      const target = window.open(url.href, `clairfle-teacher-${session}-${address.token}`, 'popup,width=1040,height=820')
      if (!target) {
        disconnect(); setError('La fenêtre de la console a été bloquée. Autorisez les fenêtres de ClairFLE, puis réessayez, ou utilisez la feuille enseignant depuis la préparation.'); return
      }
      popup.current = target
      target.opener = null
    } catch {
      disconnect(); setError('La console ne peut pas s’ouvrir. La séance continue ; la feuille enseignant reste disponible depuis la préparation.')
    }
  }, [disconnect, session])
  const bridge = useMemo<TeacherConsoleBridge>(() => ({ open, setBlocked: value => { blocked.current = value; controller.current?.publish() } }), [open])
  return { bridge, error, dialogOpen }
}
