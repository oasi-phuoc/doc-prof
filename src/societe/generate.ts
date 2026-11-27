import type { GrammarTheoryBlock } from '@/francais/grammar-theory'
import type { MathItem, PageConfig } from '@/math/types'
import { SOCIETE_KINDS } from './catalog'
import { normalizeSocieteBlock } from './legacy'
import { SOCIETE_UNITS } from './parcours'
import { isSocieteType, type SocieteQuestion, type SocieteSupport, type SocieteUnite } from './types'

const units = new Map(SOCIETE_UNITS.map((unit) => [unit.id, unit]))

function theory(block: GrammarTheoryBlock): MathItem {
  return { layout: 'theory', answer: '', noPoints: true, theoryBlock: block, grammarTheoryFalc: true }
}

function theoryItems(unit: SocieteUnite): MathItem[] {
  const items = [
    theory({ kind: 'heading', text: unit.titre }),
    theory({ kind: 'paragraph', text: unit.objectif }),
    theory({ kind: 'examples', label: 'Je regarde', items: [unit.situation] }),
  ]
  if (unit.image) items.push(theory({ kind: 'image', ...unit.image }))
  if (unit.tableau) items.push(theory({ kind: 'table', headers: unit.tableau.entetes, rows: unit.tableau.lignes }))
  return [...items,
    theory({ kind: 'heading', text: 'Je retiens', sub: true }),
    theory({ kind: 'examples', items: [...unit.explication], marker: 'puces' }),
  ]
}

function support(item: SocieteSupport): MathItem {
  return {
    layout: 'societe-support',
    answer: '',
    noPoints: true,
    hideItemNumber: true,
    societeSupport: item,
    audioSrc: item.kind === 'ecoute' ? item.audioSrc : undefined,
  }
}

function questions(entries: readonly SocieteQuestion[]): MathItem[] {
  return entries.map(({ prompt, answer, options }) => options
    ? { layout: 'select', prompt, answer, options: [...options] }
    : { layout: 'text', prompt, answer })
}

export function tryGenerateSocieteBlock(config: PageConfig): { instruction: string; items: MathItem[] } | null {
  if (!isSocieteType(config.exerciseType)) return null
  const { exerciseType } = normalizeSocieteBlock(config)
  const match = /^societe-(.+)-(theorie|lexique|ce|co|po|pe)$/.exec(exerciseType)
  if (!match) return null
  const [, id, kind] = match
  const unit = units.get(id)
  const type = SOCIETE_KINDS.find(([candidate]) => candidate === kind)
  if (!unit || !type) return null
  const instruction = kind === 'theorie' ? unit.titre : type[2]
  let items: MathItem[]
  switch (kind) {
    case 'theorie':
      items = theoryItems(unit)
      break
    case 'lexique':
      items = [
        theory({ kind: 'heading', text: `Lexique · ${unit.titre}` }),
        theory({ kind: 'table', headers: ['Mot', 'Sens'], rows: unit.lexique.map(([mot, sens]) => [mot, sens]) }),
      ]
      break
    case 'ce':
      items = [support({ kind: 'document', titre: unit.document.titre, lignes: unit.document.lignes, image: unit.document.image }), ...questions(unit.document.questions)]
      break
    case 'co':
      items = [support({
        kind: 'ecoute',
        transcription: unit.ecoute.transcription,
        audioSrc: `/lib/audio/societe/${unit.id}.mp3`,
      }), ...questions(unit.ecoute.questions)]
      break
    case 'po':
      items = [support({ kind: 'production', production: unit.oral, lignes: 0 })]
      break
    default:
      items = [support({
        kind: 'production',
        production: unit.ecrit,
        lignes: unit.niveau === 'B1' ? 9 : unit.niveau === 'A2' ? 6 : 4,
      })]
  }
  return { instruction, items }
}
