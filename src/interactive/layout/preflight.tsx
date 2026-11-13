import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import { ReadabilityPreview as Preview } from './ReadabilityPreview'
import type { PlayMode, Question, Round } from '../domain/types'
import type { ShapeId } from '../domain/palette'
import type { ClassroomHeaderProps } from '../components/ClassroomHeader'
import { fitQuestion, type Readability } from './fit'
import { originalMedia, PreparedMediaContext, type MediaResolver } from '../media/prepared-context'

export type ReadabilityPlan = { id: string; questions: Question[]; rounds?: Round[] }
export type ReadabilityOptions = Pick<ClassroomHeaderProps, 'mascot' | 'contrast' | 'timer'> & { mode: PlayMode; colors: string[]; shapes: ShapeId[] }
export type ReadabilityResult = { width: number; height: number; questionId: string } & Readability
const nextTask = () => new Promise<void>((resolve) => { const channel = new MessageChannel(); channel.port1.onmessage = () => { channel.port1.close(); channel.port2.close(); resolve() }; channel.port2.postMessage(null) })
function cancelled(signal: AbortSignal) { if (signal.aborted) throw new DOMException('Annulé', 'AbortError') }
function interruptible<T>(work: Promise<T>, signal: AbortSignal): Promise<T> {
  cancelled(signal)
  return new Promise((resolve, reject) => {
    const abort = () => reject(signal.reason ?? new DOMException('Annulé', 'AbortError'))
    signal.addEventListener('abort', abort, { once: true })
    work.then(resolve, reject).finally(() => signal.removeEventListener('abort', abort))
  })
}

/** Same-origin sandbox with its own viewport: media queries, vw/vh and fonts are measured, not guessed. */
export async function inspectReadability(plan: ReadabilityPlan, options: ReadabilityOptions, signal: AbortSignal, progress: (done: number, total: number) => void, resolve: MediaResolver = originalMedia): Promise<ReadabilityResult[]> {
  signal = AbortSignal.any([signal, AbortSignal.timeout(30_000)])
  const profiles = [[1920, 1080], [1366, 768]]
  if (window.innerWidth <= 700) profiles.push([window.innerWidth, window.innerHeight])
  const rounds = plan.rounds ?? plan.questions.map((q) => ({ id: q.id, questionIds: [q.id] }))
  const total = rounds.length * profiles.length, results: ReadabilityResult[] = []
  let done = 0
  for (const [width, height] of profiles) {
    cancelled(signal)
    const frame = document.createElement('iframe')
    frame.className = 'ci-readability-frame'; frame.width = String(width); frame.height = String(height)
    frame.setAttribute('sandbox', 'allow-same-origin'); frame.setAttribute('aria-hidden', 'true'); frame.tabIndex = -1
    frame.title = `Mesure de lisibilité ${width} × ${height}`; frame.inert = true
    document.body.append(frame)
    const doc = frame.contentDocument!
    doc.open(); doc.write('<!doctype html><html lang="fr"><head></head><body></body></html>'); doc.close()
    const base = doc.createElement('base'); base.href = document.baseURI; doc.head.append(base)
    const styles = [...document.querySelectorAll<HTMLStyleElement | HTMLLinkElement>('style, link[rel="stylesheet"]')].map((style) => {
      const clone = style.cloneNode(true) as HTMLStyleElement | HTMLLinkElement
      const pending = clone instanceof HTMLLinkElement ? new Promise<void>((resolve, reject) => { clone.onload = () => resolve(); clone.onerror = () => reject(new Error('Les styles du jeu ne peuvent pas être mesurés.')) }) : Promise.resolve()
      doc.head.append(clone); return pending
    })
    const root = createRoot(doc.body)
    try {
      await interruptible(Promise.all(styles), signal)
      for (const round of rounds) {
        const questions = round.questionIds.flatMap((id) => { const q = plan.questions.find((question) => question.id === id); return q ? [q] : [] })
        flushSync(() => root.render(<PreparedMediaContext value={resolve}><Preview questions={questions} options={options} total={plan.questions.length} /></PreparedMediaContext>))
        await interruptible(doc.fonts.ready, signal)
        await interruptible(Promise.all([...doc.images].map((image) => image.decode().catch(() => {}))), signal)
        for (const element of doc.querySelectorAll<HTMLElement>('.ci-round-question')) results.push({ width, height, questionId: element.dataset.ciQuestionId!, ...fitQuestion(element) })
        progress(++done, total)
        if (done % 4 === 0) { await nextTask(); cancelled(signal) }
      }
    } finally { root.unmount(); frame.remove() }
  }
  return results
}
