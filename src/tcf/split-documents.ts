import { isAssociationAnnonce } from './association-documents'
import type { TcfCeAnnonce, TcfExercise, TcfQuestion } from './types'

export type AnnonceDocument = {
  numero: number
  titre?: string
  texte: string
}

const DOC_HEAD_RE = /^Document\s+(\d+)\s*(?:[—–\-]\s*(.+))?$/i
const Q_DOC_RE = /^Document\s+(\d+)\s*[—–\-.]?\s*/i

/** Découpe un support en blocs « Document N — … ». */
export function parseDocumentBlocks(texte: string): AnnonceDocument[] {
  const raw = texte.replace(/\r\n/g, '\n').trim()
  if (!raw) return []
  const documents: AnnonceDocument[] = []
  let current: AnnonceDocument | null = null
  for (const line of raw.split('\n')) {
    const head = line.trim().match(DOC_HEAD_RE)
    if (head) {
      if (current && current.texte.trim()) documents.push(current)
      current = {
        numero: Number(head[1]),
        titre: head[2]?.trim() || undefined,
        texte: '',
      }
      continue
    }
    if (!current) continue
    current.texte = current.texte ? `${current.texte}\n${line}` : line
  }
  if (current && current.texte.trim()) documents.push(current)
  return documents.map((d) => ({ ...d, texte: d.texte.trim() }))
}

function singularizeConsigne(consigne: string): string {
  return consigne
    .replace(/\bces documents\b/gi, 'ce document')
    .replace(/\bles documents\b/gi, 'le document')
}

function stripDocPrefix(enonce: string): { numero: number; enonce: string } | null {
  const m = enonce.trim().match(Q_DOC_RE)
  if (!m) return null
  const rest = enonce.trim().slice(m[0].length).trim()
  return { numero: Number(m[1]), enonce: rest || enonce.trim() }
}

/**
 * « Lire des instructions » : plusieurs documents + questions « Document N — … »
 * → un exercice par document (hors association personnes).
 */
export function splitMultiDocumentAnnonce(ex: TcfExercise): TcfCeAnnonce[] | null {
  if (ex.type_exercice !== 'annonce') return null
  if (isAssociationAnnonce(ex)) return null
  const docs = parseDocumentBlocks(ex.support.texte)
  if (docs.length < 2) return null

  const byDoc = new Map<number, TcfQuestion[]>()
  for (const q of ex.questions) {
    const tagged = stripDocPrefix(q.enonce)
    if (!tagged) return null
    const list = byDoc.get(tagged.numero) ?? []
    list.push({ ...q, enonce: tagged.enonce })
    byDoc.set(tagged.numero, list)
  }
  if ([...byDoc.keys()].length < 2) return null

  const consigne = singularizeConsigne(ex.consigne ?? '')
  const parts: TcfCeAnnonce[] = []
  for (const doc of docs) {
    const questions = byDoc.get(doc.numero)
    if (!questions?.length) continue
    const titre = doc.titre?.replace(/[,….\s]+$/u, '').trim() || `Document ${doc.numero}`
    parts.push({
      ...ex,
      id: `${ex.id}-doc${doc.numero}`,
      consigne,
      support: {
        ...ex.support,
        titre,
        texte: doc.texte,
      },
      questions,
    })
  }
  return parts.length >= 2 ? parts : null
}
