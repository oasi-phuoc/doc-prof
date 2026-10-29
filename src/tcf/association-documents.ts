import type { TcfCeAnnonce, TcfLigneTableau, TcfQuestion } from '@/tcf/types'

export type AssocDocument = {
  numero: number
  /** Sous-titre éventuel après « Document N — … ». */
  titre?: string
  texte: string
}

export type AssocPersonne = {
  lettre: string
  texte: string
}

export type AssociationDocuments = {
  documents: AssocDocument[]
  personnes: AssocPersonne[]
}

const PERSONNES_RE = /\n\s*Les personnes\s*:\s*\n/i
const DOC_HEAD_RE = /^Document\s+(\d+)\s*(?:[—–\-]\s*(.+))?$/i
const PERSONNE_RE = /^([A-H])\.\s*(.+)$/i

/** Découpe un texte « Document 1… / Les personnes : A.… ». */
export function parseAssociationDocuments(texte: string): AssociationDocuments | null {
  const raw = texte.replace(/\r\n/g, '\n').trim()
  if (!raw || !PERSONNES_RE.test(raw)) return null
  const parts = raw.split(PERSONNES_RE)
  if (parts.length < 2) return null
  const docsPart = (parts[0] ?? '').trim()
  const persPart = parts.slice(1).join('\n').trim()

  const documents: AssocDocument[] = []
  let current: AssocDocument | null = null
  for (const line of docsPart.split('\n')) {
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

  const personnes: AssocPersonne[] = []
  for (const line of persPart.split('\n')) {
    const m = line.trim().match(PERSONNE_RE)
    if (!m) continue
    personnes.push({ lettre: m[1]!.toUpperCase(), texte: m[2]!.trim() })
  }

  if (documents.length < 2 || personnes.length < 2) return null
  return {
    documents: documents.map((d) => ({ ...d, texte: d.texte.trim() })),
    personnes,
  }
}

/** « Document 1 » → « B. Myriam » ⇒ { B: 1 }. */
export function documentNumeroByLettre(
  tableau: TcfLigneTableau[] | undefined,
): Record<string, number> {
  const out: Record<string, number> = {}
  for (const row of tableau ?? []) {
    const doc = row.label.match(/Document\s+(\d+)/i)
    const lettre = row.reponse.match(/^\s*([A-H])\b/i)
    if (!doc || !lettre) continue
    out[lettre[1]!.toUpperCase()] = Number(doc[1])
  }
  return out
}

/** Annonce CE « associez documents / personnes » (Lire pour s’orienter). */
export function isAssociationAnnonce(ex: TcfCeAnnonce): boolean {
  const parsed = parseAssociationDocuments(ex.support.texte)
  if (!parsed) return false
  const q = ex.questions.find((question) => associationTableau(question))
  return Boolean(q)
}

export function associationTableau(q: TcfQuestion): TcfLigneTableau[] | undefined {
  const tab = q.tableau?.filter((row) => /Document\s+\d+/i.test(row.label))
  return tab && tab.length >= 2 ? tab : undefined
}

export function associationAnswersFromExercise(ex: TcfCeAnnonce): Record<string, number> {
  for (const q of ex.questions) {
    const tab = associationTableau(q)
    if (tab) return documentNumeroByLettre(tab)
  }
  return {}
}
