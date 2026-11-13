import type { MathItem } from '@/math/types'
import { createRng, shuffle } from '@/math/rng'
import type { Choice } from './types'
import { hash } from './seeds'

type Entry = { part: number; prompt: string; instruction: string; choices: Choice[]; correctId?: string; model: string; teacherLed?: boolean }
type Result = { items: Entry[]; issues: string[] }
const key = (text: string) => text.normalize('NFC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('fr')
const filled = (value: unknown): value is string => typeof value === 'string' && !!value.trim() && !/^(?:…\d*|\.{3,})$/.test(value.trim())
const numbered = (value: unknown): value is string => typeof value === 'string' && /^[1-9]\d?$/.test(value)

/** Read authored clues and explicit answer keys, never infer an odd word from
 * its spelling, its image or the theme. The paper layout remains independent. */
export function adaptPrintableRiddles(
  items: MathItem[], exerciseType: string, seedFor: (item: number, part: number) => number,
): Map<number, Result> | undefined {
  if (!['jeux-devinettes', 'jeux-intrus'].includes(exerciseType)) return undefined
  const indices = items.flatMap((item, index) => item.layout === 'card-grid' ? [index] : [])
  if (!indices.length) return undefined
  const results = new Map(indices.map(index => [index, { items: [], issues: [] } as Result]))
  const fail = (reason: string) => { results.get(indices[0]!)!.issues.push(reason); return results }
  const kind = exerciseType === 'jeux-devinettes' ? 'devinettes' : 'intrus'
  if (indices.some(index => {
    const item = items[index]!, board = item.gameBoard
    return item.libreError || item.answer?.trim() || item.prompt?.trim() || !board || board.kind !== kind ||
      !['recto', 'verso'].includes(board.side ?? '') || !Number.isInteger(board.cols) || !Number.isInteger(board.rows) ||
      board.cols < 1 || board.rows < 1 || board.cols * board.rows > 400 || !Array.isArray(board.cards) ||
      !board.cards.length || board.cards.length > 64 || board.cards.length > board.cols * board.rows ||
      board.cards.some(card => !card || !filled(card.id)) || new Set(board.cards.map(card => card.id)).size !== board.cards.length
  })) return fail('Les planches de devinettes ou d’intrus sont absentes, non validées ou incohérentes. Vérifiez la fiche source.')
  const fronts = indices.filter(index => items[index]!.gameBoard!.side === 'recto')
  const backs = indices.filter(index => items[index]!.gameBoard!.side === 'verso')
  if (fronts.length !== 1 || backs.length > 1 || kind === 'devinettes' && backs.length !== 1)
    return fail('Il faut un seul recto et son verso pour retrouver les indices de la fiche.')
  const frontIndex = fronts[0]!, front = items[frontIndex]!.gameBoard!, output = results.get(frontIndex)!
  if (kind === 'intrus') {
    if (front.cards.some(card => card.variant !== 'scatter') || backs.some(index => items[index]!.gameBoard!.cards.some(card => card.variant !== 'series-back')))
      return fail('Ces cartes ne décrivent pas des groupes de mots avec un dos de série.')
    front.cards.forEach((card, part) => {
      const words = Array.isArray(card.scatter) ? card.scatter.map(word => word?.text) : undefined
      if (!words || words.length < 3 || words.length > 6 || words.some(word => !filled(word) || /^mot\d+$/i.test(word.trim())) ||
        new Set(words.map(key)).size !== words.length) {
        output.issues.push(`Carte ${part + 1} : il faut trois à six mots source distincts et complets.`); return
      }
      if (!filled(card.intrusAnswer) || words.filter(word => key(word) === key(card.intrusAnswer!)).length !== 1) {
        output.issues.push(`Carte ${part + 1} : corrigé Intrus absent ou incohérent. Régénérez cette planche depuis son modèle ; aucun intrus n’est déduit des mots.`); return
      }
      const choices = shuffle(createRng(seedFor(frontIndex, part)), words.map(text => ({ id: `intrus-word-${hash(key(text))}`, text })))
      if (new Set(choices.map(choice => choice.id)).size !== choices.length) { output.issues.push(`Carte ${part + 1} : références des mots impossibles à distinguer.`); return }
      const correct = choices.find(choice => key(choice.text) === key(card.intrusAnswer!))!
      output.items.push({ part, prompt: 'Quel mot est l’intrus ?', instruction: 'Choisis le mot qui ne va pas avec les autres.', choices, correctId: correct.id, model: correct.text })
    })
    return results
  }
  const back = items[backs[0]!]!.gameBoard!
  if (front.cards.some(card => card.variant !== 'word' || !numbered(card.badge)) ||
    back.cards.some(card => card.variant !== 'clue' || !numbered(card.badge)) ||
    new Set(front.cards.map(card => card.badge)).size !== front.cards.length || new Set(back.cards.map(card => card.badge)).size !== back.cards.length ||
    front.cards.length !== back.cards.length || back.cards.some(card => !front.cards.some(other => other.badge === card.badge)))
    return fail('Les numéros des mots et des indices sont absents, répétés ou incomplets. Aucune devinette n’est choisie arbitrairement.')
  const words = front.cards.filter(card => filled(card.text))
  const clues = words.map(card => ({ card, clue: back.cards.find(other => other.badge === card.badge)!.text }))
  const unique = [...new Map(words.map(card => [key(card.text!), card.text!.trim()])).entries()]
  const pool = unique.map(([identity, text]) => {
    const images = [...new Set(words.filter(card => key(card.text!) === identity).flatMap(card => filled(card.imageSrc) ? [card.imageSrc.trim()] : []))]
    return { id: `riddle-word-${hash(identity)}`, text, ...(images.length === 1 ? { image: images[0] } : {}) }
  })
  if (new Set(pool.map(choice => choice.id)).size !== pool.length) return fail('Les références des réponses des devinettes ne permettent pas de distinguer les mots.')
  front.cards.forEach((card, part) => {
    const clue = back.cards.find(other => other.badge === card.badge)!.text
    if (!filled(card.text)) { if (filled(clue)) output.issues.push(`Devinette ${card.badge} : mot correspondant absent.`); return }
    if (!filled(clue)) { output.issues.push(`Devinette ${card.badge} : indice absent.`); return }
    if (key(clue) === 'décrivez ce mot sans dire son nom.') {
      output.issues.push(`Devinette ${card.badge} : la fiche fournit une consigne orale générale, sans indice permettant de deviner le mot. Complétez l’indice dans la fiche source.`); return
    }
    const models = [...new Map(clues.filter(other => filled(other.clue) && key(other.clue) === key(clue)).map(other => [key(other.card.text!), other.card.text!.trim()])).values()]
    const teacherLed = models.length !== 1 || pool.length < 2
    const correct = pool.find(choice => key(choice.text) === key(card.text!))!
    const rng = createRng(seedFor(frontIndex, part))
    const choices = teacherLed ? [] : shuffle(rng, [correct, ...shuffle(rng, pool.filter(choice => choice.id !== correct.id)).slice(0, 5)])
    output.items.push({ part, prompt: `Quel est le mot\u00a0?\n${clue.trim()}`, instruction: 'Lis l’indice puis choisis le mot correspondant.', choices,
      ...(teacherLed ? { teacherLed: true } : { correctId: correct.id }), model: models.join(' / ') })
    if (teacherLed) output.issues.push(`Devinette ${card.badge} : cet indice a plusieurs mots source ou aucune alternative. L’enseignant apprécie la réponse.`)
  })
  return results
}
