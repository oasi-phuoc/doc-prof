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
  const parts = exerciseTranscriptionParts(ex)
  return parts.length ? parts.map((part) => part.formattedText).join('\n\n') : null
}

type TranscriptionPart = { text: string; formattedText: string; label?: string }

/** Une transcription par piste, avec la numérotation d’origine des documents. */
function exerciseTranscriptionParts(ex: TcfExercise): TranscriptionPart[] {
  const support = 'support' in ex ? ex.support : undefined
  if (!support || !('transcription' in support)) return []
  const raw = support.transcription
  if (raw == null) return []

  if (Array.isArray(raw)) {
    return raw
      .map((t, i): TranscriptionPart | null => {
        const s = String(t ?? '').trim()
        if (!s) return null
        const existing = ex.type_exercice === 'association_images'
          ? /^(Dialogue|Message)\s+\d+/i.exec(s)
          : /^Document\s+\d+/i.exec(s)
        const label = existing?.[0] ?? `${ex.type_exercice === 'association_images' ? 'Dialogue' : 'Document'} ${i + 1}`
        return { text: s, label, formattedText: existing ? s : `${label} — ${s}` }
      })
      .filter((part): part is TranscriptionPart => part !== null)
  }

  const s = String(raw).trim()
  return s ? [{ text: s, formattedText: s }] : []
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

/** Une entrée par piste ; un exercice réparti sur plusieurs feuilles reste unique. */
export function collectWorksheetTranscriptions(sheets: WorksheetPage[]): TranscriptionEntry[] {
  const out: TranscriptionEntry[] = []
  const seen = new Set<string>()
  for (const sheet of sheets) {
    for (const block of sheet.blocks) {
      for (const item of block.items) {
        const tcf = item.tcf
        if (!tcf || tcf.kind !== 'support') continue
        const ex = tcf.exercise
        const parts = exerciseTranscriptionParts(ex)
        if (parts.length === 0) continue
        const key = `${ex.id}::${block.exerciseIndex}`
        if (seen.has(key)) continue
        seen.add(key)
        for (const part of parts) {
          out.push({
            exerciseNo: block.exerciseIndex,
            title: [entryTitle(ex), part.label].filter(Boolean).join(' — '),
            text: part.text,
          })
        }
      }
    }
  }
  return out
}

/**
 * Chaque dialogue/document commence sur une page A4 distincte.
 * Un texte long peut continuer sur ses propres pages, sans autre dialogue.
 */
export function paginateTranscriptions(
  entries: TranscriptionEntry[],
  charsPerPage = 2400,
): TranscriptionEntry[][] {
  const overhead = (e: TranscriptionEntry) => 80 + e.title.length
  return entries.flatMap((entry) =>
    splitLongEntry(entry, charsPerPage - overhead(entry)).map((chunk) => [chunk]),
  )
}

/** Couper un paragraphe aux espaces conserve les mots d’une page à l’autre. */
function splitParagraph(text: string, limit: number): string[] {
  const parts: string[] = []
  let rest = text.trim()
  while (rest.length > limit) {
    const boundary = rest.slice(0, limit + 1).search(/\s+\S*$/)
    const cut = boundary > 0 ? boundary : limit
    parts.push(rest.slice(0, cut).trim())
    rest = rest.slice(cut).trimStart()
  }
  if (rest) parts.push(rest)
  return parts
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
        for (const text of splitParagraph(p, limit)) {
          parts.push({
            exerciseNo: entry.exerciseNo,
            title: `${entry.title || `Exercice ${entry.exerciseNo}`} (suite)`,
            text,
          })
        }
      } else {
        buf = p
      }
    } else if (next.length > limit) {
      for (const [i, text] of splitParagraph(next, limit).entries()) {
        parts.push({
          exerciseNo: entry.exerciseNo,
          title:
            i === 0
              ? entry.title
              : `${entry.title || `Exercice ${entry.exerciseNo}`} (suite)`,
          text,
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
