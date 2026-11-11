import type { Question } from './types'

/** Only an explicit listening instruction sets a quota; ordinary audio stays unlimited. */
export function maxListensFor(questions: Question[]): number | undefined {
  const limits = questions.flatMap((question) => {
    if (question.audioMaxListens !== undefined) return [question.audioMaxListens]
    const text = (question.instruction ?? '').replace(/\[\[[^\]]*\]\]/g, '').normalize('NFC')
    const match = /\b(?:il y a|maximum(?: de)?|au maximum|limit[eé]e?s? [àa])\s+(\d{1,2})\s+[eé]coutes?\b/i.exec(text)
    return match ? [Number(match[1])] : []
  }).filter((limit) => Number.isInteger(limit) && limit >= 1 && limit <= 20)
  return limits.length ? Math.min(...limits) : undefined
}

export function canListen(listens: number, extra: number, maximum?: number): boolean {
  return listens < 10_000 && (maximum === undefined || listens < maximum + extra)
}

/** One native playing event from the beginning counts once, including pause/resume. */
export class ListeningPass {
  active = false
  lastTime = 0
  begin(time: number): boolean {
    if (this.active || time < 0 || time >= 0.5) return false
    this.active = true
    return true
  }
  seek(time: number): void {
    if (time < 0.5 && this.lastTime >= 0.5) this.active = false
    this.lastTime = time
  }
  end(): void { this.active = false; this.lastTime = 0 }
}
