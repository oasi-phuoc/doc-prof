import type { WorksheetPage } from '@/math/types'
import type { TcfExercise } from './types'

export type TranscriptionEntry = {
  /** N° d’exercice affiché sur la fiche. */
  exerciseNo: number
  /** Titre court (scène / thème). */
  title: string
  text: string
}

/** Texte de transcription normalisé pour le corrigé (Documents / Dialogues). */
export function formatExerciseTranscription(ex: TcfExercise): string | null {
  const support = 'support' in ex ? ex.support : undefined
  if (!support || !('transcription' in support)) return null
  const raw = support.transcription
  if (raw == null) return null

  if (Array.isArray(raw)) {
    const lines = raw
      .map((t, i) => {
        const s = String(t ?? '').trim()
        if (!s) return ''
        if (ex.type_exercice === 'association_images') {
          return /^(Dialogue|Message)\s+\d+/i.test(s) ? s : `Dialogue ${i + 1} — ${s}`
        }
        return /^Document\s+\d+/i.test(s) ? s : `Document ${i + 1} — ${s}`
      })
      .filter(Boolean)
    return lines.length ? lines.join('\n\n') : null
  }

  const s = String(raw).trim()
  return s || null
}

function entryTitle(ex: TcfExercise): string {
  const scene = 'scene' in ex && typeof ex.scene === 'string' ? ex.scene.trim() : ''
  if (scene) return scene
  const theme = 'theme' in ex && typeof ex.theme === 'string' ? ex.theme.trim() : ''
  if (theme) {
    const tail = theme.split('·').pop()?.trim()
    return tail || theme
  }
  return ''
}

/** Parcourt les fiches et ramasse une entrée par exercice audio avec transcription. */
export function collectWorksheetTranscriptions(sheets: WorksheetPage[]): TranscriptionEntry[] {
  const out: TranscriptionEntry[] = []
  const seen = new Set<string>()
  for (const sheet of sheets) {
    for (const block of sheet.blocks) {
      for (const item of block.items) {
        const tcf = item.tcf
        if (!tcf || tcf.kind !== 'support') continue
        const ex = tcf.exercise
        const text = formatExerciseTranscription(ex)
        if (!text) continue
        const key = `${ex.id}::${block.exerciseIndex}`
        if (seen.has(key)) continue
        seen.add(key)
        out.push({
          exerciseNo: block.exerciseIndex,
          title: entryTitle(ex),
          text,
        })
      }
    }
  }
  return out
}

/**
 * Découpe les transcriptions en paquets pour des A4 (estimation caractères).
 * Une entrée trop longue peut seule occuper plusieurs pages.
 */
export function paginateTranscriptions(
  entries: TranscriptionEntry[],
  charsPerPage = 2400,
): TranscriptionEntry[][] {
  if (entries.length === 0) return []
  const pages: TranscriptionEntry[][] = []
  let current: TranscriptionEntry[] = []
  let used = 0

  const flush = () => {
    if (current.length) pages.push(current)
    current = []
    used = 0
  }

  const overhead = (e: TranscriptionEntry) => 80 + e.title.length

  for (const entry of entries) {
    const chunks = splitLongEntry(entry, charsPerPage - overhead(entry))
    for (const chunk of chunks) {
      const cost = overhead(chunk) + chunk.text.length
      if (current.length > 0 && used + cost > charsPerPage) flush()
      current.push(chunk)
      used += cost
    }
  }
  flush()
  return pages
}

function splitLongEntry(entry: TranscriptionEntry, maxChars: number): TranscriptionEntry[] {
  const limit = Math.max(400, maxChars)
  if (entry.text.length <= limit) return [entry]
  const parts: TranscriptionEntry[] = []
  const paragraphs = entry.text.split(/\n{2,}/)
  let buf = ''
  const push = () => {
    if (!buf.trim()) return
    parts.push({
      exerciseNo: entry.exerciseNo,
      title: parts.length
        ? `${entry.title || `Exercice ${entry.exerciseNo}`} (suite)`
        : entry.title,
      text: buf.trim(),
    })
    buf = ''
  }
  for (const p of paragraphs) {
    const next = buf ? `${buf}\n\n${p}` : p
    if (next.length > limit && buf) {
      push()
      if (p.length > limit) {
        // Paragraphe trop long : coupe brute.
        for (let i = 0; i < p.length; i += limit) {
          parts.push({
            exerciseNo: entry.exerciseNo,
            title: `${entry.title || `Exercice ${entry.exerciseNo}`} (suite)`,
            text: p.slice(i, i + limit).trim(),
          })
        }
      } else {
        buf = p
      }
    } else if (next.length > limit) {
      for (let i = 0; i < next.length; i += limit) {
        parts.push({
          exerciseNo: entry.exerciseNo,
          title:
            i === 0
              ? entry.title
              : `${entry.title || `Exercice ${entry.exerciseNo}`} (suite)`,
          text: next.slice(i, i + limit).trim(),
        })
      }
      buf = ''
    } else {
      buf = next
    }
  }
  push()
  return parts.length ? parts : [entry]
}
