import type { MathItem } from '@/math/types'
import { resolvePrintablePairs, type PrintablePair, type PrintablePairResult } from './printable-pairs'

type Board = NonNullable<MathItem['gameBoard']>
type Card = Board['cards'][number]
const key = (text: string) => text.normalize('NFC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('fr')
const filled = (value: unknown): value is string => typeof value === 'string' && !!value.trim() && !/^…\d*$/.test(value.trim())
const dimensions = (board: { cols: number; rows: number }) => Number.isInteger(board.cols) && Number.isInteger(board.rows) && board.cols >= 1 && board.rows >= 1 && board.cols * board.rows <= 400
const validCards = (cards: unknown): cards is Card[] => Array.isArray(cards) && cards.length <= 64 && cards.every(card => card && filled(card.id)) && new Set(cards.map(card => card.id)).size === cards.length
const sameWords = (a: string[], b: string[]) => JSON.stringify(a.map(key).sort()) === JSON.stringify(b.map(key).sort())

/** Loto supplies its explicit caller cards. A domino supplies its own image
 * label, never the following word printed on its right half. These banks feed
 * M06 questions; their full tabletop rules are not re-created here. */
export function adaptPrintableDecks(
  items: MathItem[], exerciseType: string, seedFor: (item: number, part: number) => number,
  displayedImage: (src: string) => string = src => src,
): Map<number, PrintablePairResult> | undefined {
  if (!['jeux-dominos', 'jeux-loto'].includes(exerciseType)) return undefined
  const indices = items.flatMap((item, index) => item.layout === 'card-grid' ? [index] : [])
  if (!indices.length) return undefined
  const result = new Map(indices.map(index => [index, { items: [], issues: [] } as PrintablePairResult]))
  const fail = (reason: string) => { result.get(indices[0]!)!.issues.push(reason); return result }
  const domino = exerciseType === 'jeux-dominos', kinds = domino ? ['dominos'] : ['loto-page', 'loto-back', 'loto-call']
  if (indices.some(index => {
    const item = items[index]!, board = item.gameBoard
    return item.libreError || item.answer?.trim() || item.prompt?.trim() || !board || !kinds.includes(board.kind ?? '') || !dimensions(board) || !validCards(board.cards) || board.cards.length > board.cols * board.rows
  })) return fail('Les planches Dominos ou Loto sont absentes, non validées ou incohérentes. Vérifiez la fiche source.')
  let sourceIndex: number
  if (domino) {
    if (indices.some(index => !['recto', 'verso'].includes(items[index]!.gameBoard!.side ?? ''))) return fail('La face des dominos est absente ou incohérente.')
    const fronts = indices.filter(index => items[index]!.gameBoard!.side === 'recto'), backs = indices.filter(index => items[index]!.gameBoard!.side === 'verso')
    if (fronts.length !== 1 || backs.length > 1) return fail('Il faut un seul recto de dominos et au maximum son dos de série.')
    sourceIndex = fronts[0]!
    const front = items[sourceIndex]!.gameBoard!
    if (!front.cards.length || front.cards.some(card => card.variant !== 'domino') || backs.some(index => items[index]!.gameBoard!.cards.some(card => card.variant !== 'series-back')))
      return fail('Ces cartes ne décrivent pas des dominos avec leur dos de série.')
    if (front.cards.some(card => typeof card.dominoWord !== 'string' || typeof card.textRight !== 'string'))
      return fail('Les libellés des images de ces anciens dominos ne sont pas conservés. Régénérez la planche depuis son modèle ; le mot à droite désigne le domino suivant.')
    if (!sameWords(front.cards.map(card => card.dominoWord!), front.cards.map(card => card.textRight!)))
      return fail('Les mots imprimés et les libellés des images des dominos ne correspondent pas. Vérifiez la planche source.')
  } else {
    const calls = indices.filter(index => items[index]!.gameBoard!.kind === 'loto-call')
    if (calls.length !== 1) return fail('Il faut un seul lot de cartes animateur pour retrouver les paires du Loto.')
    sourceIndex = calls[0]!
    const caller = items[sourceIndex]!.gameBoard!
    if (!caller.cards.length || caller.cards.some(card => !['default', 'word'].includes(card.variant ?? '') || !filled(card.text)))
      return fail('Les cartes animateur du Loto doivent contenir des mots explicites et complets.')
    const callWords = new Set(caller.cards.map(card => key(card.text!)))
    for (const index of indices.filter(index => index !== sourceIndex)) {
      const board = items[index]!.gameBoard!
      if (board.cards.length || !Array.isArray(board.panels) || !board.panels.length || board.panels.length > 3 || board.side !== undefined)
        return fail('Les grilles imprimées du Loto sont incohérentes avec leur lot animateur.')
      for (const panel of board.panels) {
        if (!panel || !dimensions(panel) || !validCards(panel.cards) || panel.cards.length > panel.cols * panel.rows ||
          (board.kind === 'loto-back' ? panel.cards.length !== 0 : !panel.cards.length || panel.cards.some(card => !['default', 'word'].includes(card.variant ?? '') || !filled(card.text) || !callWords.has(key(card.text)))))
          return fail('Une grille du Loto est invalide ou contient un mot absent du lot animateur. Vérifiez la fiche source.')
      }
    }
  }
  const output = result.get(sourceIndex)!, pairs: PrintablePair[] = []
  items[sourceIndex]!.gameBoard!.cards.forEach((card, part) => {
    const text = domino ? card.dominoWord : card.text
    if (!filled(text)) { if (filled(card.imageSrc)) output.issues.push(`Paire ${part + 1} : mot absent ou provisoire.`); return }
    if (!filled(card.imageSrc)) { output.issues.push(`Paire ${part + 1} : image absente.`); return }
    const image = displayedImage(card.imageSrc)
    if (!filled(image)) { output.issues.push(`Paire ${part + 1} : image remplacée absente.`); return }
    pairs.push({ part, image, sourceImage: card.imageSrc, text: text.trim(), label: card.badge ?? String(part + 1) })
  })
  if (!pairs.length && !output.issues.length) output.issues.push('Aucune paire image/mot exploitable dans ces planches.')
  const resolved = resolvePrintablePairs(pairs, part => seedFor(sourceIndex, part))
  output.items.push(...resolved.items); output.issues.push(...resolved.issues)
  return result
}
